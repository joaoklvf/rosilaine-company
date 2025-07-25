import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, of, tap } from "rxjs";
import { BrDatePickerComponent } from "src/app/components/br-date-picker/br-date-picker.component";
import { CustomAutocompleteComponent } from "src/app/components/custom-autocomplete/custom-autocomplete.component";
import { InputMaskComponent } from "src/app/components/input-mask/input-mask.component";
import { Customer } from "src/app/models/customer/customer";
import { EndCustomer } from "src/app/models/customer/end-customer";
import { Order } from "src/app/models/order/order";
import { OrderItem } from "src/app/models/order/order-item/order-item";
import { OrderItemStatus } from "src/app/models/order/order-item/order-item-status";
import { OrderStatus } from "src/app/models/order/order-status";
import { Product } from "src/app/models/product/product";
import { CustomerService } from "src/app/services/customer/customer.service";
import { EndCustomerService } from "src/app/services/customer/end-customer/end-customer.service";
import { OrderItemStatusService } from "src/app/services/order/order-item-status/order-item-status.service";
import { OrderItemService } from "src/app/services/order/order-item/order-item.service";
import { OrderStatusService } from "src/app/services/order/order-status/order-status.service";
import { OrderService } from "src/app/services/order/order.service";
import { ProductService } from "src/app/services/product/product.service";
import { SnackBarService } from "src/app/services/snack-bar/snack-bar.service";
import { getBrCurrencyStr, getBrDateStr } from "src/app/utils/text-format";
import { InstallmentManagementComponent } from "./components/installments/installment-management/installment-management.component";
import { InstallmentsHeaderComponent } from "./components/installments-header/installments-header.component";

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss',
  imports: [InputMaskComponent, CustomAutocompleteComponent, FormsModule, BrDatePickerComponent, MatSelectModule, MatFormFieldModule, MatIconModule, MatInputModule, InstallmentsHeaderComponent],
})

export class OrderCreateComponent implements OnInit {
  order = new FormControl(new Order());
  orderItem = new OrderItem();
  orderTotal = '';
  customers: Customer[] = [];
  endCustomers: EndCustomer[] = [];
  products: Product[] = [];
  orderStatuses: OrderStatus[] = [];
  orderItemStatuses: OrderItemStatus[] = [];
  title = 'Cadastrar pedido';
  addUpdateItemButtonText = 'Adicionar';

  readonly dialog = inject(MatDialog);

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private orderStatusService: OrderStatusService,
    private route: ActivatedRoute,
    private orderItemStatusService: OrderItemStatusService,
    private orderItemService: OrderItemService,
    private snackBarService: SnackBarService,
    private router: Router,
    private endCustomerService: EndCustomerService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id)
      this.loadOrder(id);

    this.customerService.get()
      .subscribe(customers => this.customers = customers[0]);

    this.productService.get()
      .subscribe(products => this.products = products[0]);

    this.orderStatusService.get()
      .subscribe(status => this.orderStatuses = status[0]);

    this.orderItemStatusService.get()
      .subscribe(itemStatus => this.orderItemStatuses = itemStatus[0]);
  }

  loadOrder(id: string) {
    this.orderService.getById(id)
      .subscribe(order => {
        if (!order) {
          this.snackBarService.error('Pedido não encontrado');
          this.router.navigate(['orders']);
        }

        this.order.setValue({ ...order })
        this.orderTotal = getBrCurrencyStr(order.total);
        this.getEndCustomers(order.customer.id!)
      });

    this.title = 'Editar pedido';
  }

  getError() {
    const orderItem = { ...this.orderItem };
    const order = { ...this.order.value };

    if (orderItem.itemAmount <= 0)
      return 'Insira a quantidade do produto';

    if (!orderItem.product.id)
      return 'Selecione um produto';

    if (!order.status?.description)
      return 'Defina o status do pedido';

    if (!orderItem.itemStatus?.description)
      return 'Defina o status do produto';

    if (!order.customer?.id)
      return 'Selecione um cliente';

    return null;
  }

  addUpdateItem(): void {
    const error = this.getError();
    if (error) {
      this.snackBarService.error(error);
      return;
    }

    const orderItem = { ...this.orderItem };
    const prevItems = [...this.order.value!.orderItems];
    const orderItems = orderItem.id
      ? prevItems.map(item => item.id === orderItem.id ? { ...orderItem } : item)
      : [...prevItems, orderItem];

    const order: Order = {
      ...this.order.value!,
      orderItems: orderItems,
    }

    this.createUpdateOrder(order);
  }

  createUpdateOrder(order: Order) {
    if (order.id) {
      this.orderService.update(order)
        .subscribe(orderResponse => {
          this.updateOrder(orderResponse);
        });
    }
    else {
      const orderRequest = { ...order, installmentsAmount: 1 };
      this.orderService.add(orderRequest)
        .subscribe(orderResponse => {
          this.router.navigate([`/order/${orderResponse.id}`])
        });
    }
  }

  remove(orderItem: OrderItem): void {
    const newItems = this.order.value!.orderItems.filter(p => p.id !== orderItem.id);
    this.createUpdateOrder({ ...this.order.value!, orderItems: newItems });
  }

  edit(orderItem: OrderItem): void {
    this.orderItem = { ...orderItem };
    this.orderItem.itemStatus = orderItem.itemStatus;
    this.changeAddUpdateItemButtonText();
  }

  update(orderItem: OrderItem, index: number): void {
    this.order.value!.orderItems[index] = orderItem;
  }

  getCurrencyValue = (value: number) =>
    getBrCurrencyStr(value);

  setPrice(value: number) {
    this.orderItem.itemSellingPrice = value;
  }

  setOrderDate(value: Date) {
    this.order.value!.orderDate = value;
  }

  setFirstInstallmentDate(value: Date) {
    this.order.value!.firstInstallmentDate = value;
  }

  setCustomer(customer: Customer | null) {
    if (!customer)
      return;

    this.order.setValue({ ...this.order.value!, customer });
    this.getEndCustomers(customer.id!);
  }

  setEndCustomer(endCustomer: EndCustomer | null) {
    if (endCustomer)
      this.order.setValue({ ...this.order.value!, endCustomer })
  }

  getEndCustomers(customerId: string) {
    this.endCustomerService.get(customerId)
      .subscribe(endCustomers => this.endCustomers = endCustomers[0]);
  }

  setProduct(value: Product | null) {
    if (!(value && value.id)) {
      if (this.orderItem.product.id) {
        this.clearItem();
      }
      return;
    }

    this.orderItem.product = { ...value };
    this.orderItem.itemSellingPrice = value.productPrice;
    this.orderItem.itemOriginalPrice = value.productPrice;
  }

  setOrderStatus(value: OrderStatus | null) {
    if (value)
      this.order.value!.status = value;
  }

  setOrderItemStatus(value: OrderItemStatus | null) {
    if (value)
      this.orderItem.itemStatus = value;
  }

  changeItemStatus(selectEvent: MatSelectChange<string>, orderItemSelected: OrderItem) {
    const optionSelected = this.orderItemStatuses.find(x => x.id === selectEvent.value);
    if (!optionSelected)
      return;

    const orderItemChanged = { ...orderItemSelected, itemStatus: optionSelected };
    this.orderItemService.update(orderItemChanged).subscribe(orderItem => {
      const prevItems = [...this.order.value!.orderItems];
      const orderItems = orderItem.id
        ? prevItems.map(item => item.id === orderItem.id ? { ...orderItem } : item)
        : [...prevItems, orderItem];

      this.order.value!.orderItems = orderItems;
    })
  }

  getBrDate(value: Date | null) {
    return value && getBrDateStr(value);
  }

  updateOrder(order: Order) {
    this.updateStatusesByOrder(order);
    this.orderItem = new OrderItem();
    this.order.setValue({ ...order });
    this.orderTotal = getBrCurrencyStr(order.total);
    this.changeAddUpdateItemButtonText();
    this.snackBarService.success('Pedido atualizado com sucesso!');
  }

  updateStatusesByOrder(order: Order) {
    if (!this.orderStatuses.find(x => x.id === order.status.id))
      this.orderStatuses = [...this.orderStatuses, order.status]

    const currentOrderItemStatuses = order.orderItems.map(x => x.itemStatus);
    const newOrderItemStatuses = currentOrderItemStatuses.filter(x => !this.orderItemStatuses.find(y => y.id === x.id));
    if (newOrderItemStatuses.length)
      this.orderItemStatuses = [...this.orderItemStatuses, ...newOrderItemStatuses];
  }

  saveOrder(order: Order) {
    this.order.setValue({ ...order });
  }

  installmentsManagement() {
    this.dialog.open(InstallmentManagementComponent, {
      width: '1000px',
      data: {
        order: { ...this.order.value },
        saveOrder: (order: Order) => this.saveOrder(order)
      }
    });
  }

  print() {
    sessionStorage.setItem('order', JSON.stringify(this.order.value))
    this.router.navigate(['order-print'])
  }

  clearItem() {
    this.orderItem = new OrderItem();
    this.changeAddUpdateItemButtonText();
  }

  changeAddUpdateItemButtonText() {
    this.addUpdateItemButtonText = this.orderItem.id ?
      'Atualizar' : 'Adicionar';
  }

  setOrderItemDeliveryDate(value: Date, item: OrderItem) {
    this.updateDeliveryDate(value, item);
  }

  setOrderItemDeliveryToday(item: OrderItem) {
    this.updateDeliveryDate(new Date(), item);
  }

  updateDeliveryDate(deliveryDate: Date, orderItem: OrderItem) {
    this.orderItemService.update({ ...orderItem, deliveryDate })
      .pipe(
        tap(_ => {
          orderItem.deliveryDate = deliveryDate;
          this.snackBarService.success('Data de entrega atualizada com sucesso');
        }),
        catchError(() => of(this.snackBarService.error('Falha ao data de entrega')))
      )
      .subscribe();
  }
}
