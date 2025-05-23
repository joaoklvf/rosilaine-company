import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule, MatSelectChange } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxMaskDirective } from "ngx-mask";
import { BrDatePickerComponent } from "src/app/components/br-date-picker/br-date-picker.component";
import { CustomAutocompleteComponent } from "src/app/components/custom-autocomplete/custom-autocomplete.component";
import { InputMaskComponent } from "src/app/components/input-mask/input-mask.component";
import { Customer } from "src/app/models/customer/customer";
import { Order } from "src/app/models/order/order";
import { OrderItem } from "src/app/models/order/order-item/order-item";
import { OrderItemStatus } from "src/app/models/order/order-item/order-item-status";
import { OrderStatus } from "src/app/models/order/order-status";
import { Product } from "src/app/models/product/product";
import { CustomerService } from "src/app/services/customer/customer.service";
import { OrderItemStatusService } from "src/app/services/order/order-item-status/order-item-status.service";
import { OrderItemService } from "src/app/services/order/order-item/order-item.service";
import { OrderStatusService } from "src/app/services/order/order-status/order-status.service";
import { OrderService } from "src/app/services/order/order.service";
import { ProductService } from "src/app/services/product/product.service";
import { SnackBarService } from "src/app/services/snack-bar/snack-bar.service";
import { getBrCurrencyStr, getBrDateStr } from "src/app/utils/text-format";
import { InstallmentManagementComponent } from "./installments/installment-management/installment-management.component";
import { InstallmentsSelectComponent } from "./installments/installments-select/installments-select.component";

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss',
  imports: [InputMaskComponent, CustomAutocompleteComponent, FormsModule, BrDatePickerComponent, MatSelectModule, MatFormFieldModule, MatIconModule, InstallmentsSelectComponent, NgxMaskDirective, MatInputModule],
})

export class OrderCreateComponent implements OnInit {
  order = new Order();
  orderItem = new OrderItem();
  orderTotal = '';
  customers: Customer[] = [];
  products: Product[] = [];
  orderStatus: OrderStatus[] = [];
  orderItemStatus: OrderItemStatus[] = [];
  title = 'Cadastrar pedido';
  readonly dialog = inject(MatDialog);

  constructor(private orderService: OrderService, private customerService: CustomerService, private productService: ProductService, private orderStatusService: OrderStatusService, private route: ActivatedRoute, private orderItemStatusService: OrderItemStatusService, private orderItemService: OrderItemService, private snackBarService: SnackBarService, private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.orderService.getById(id)
        .subscribe(order => {
          if (!order) {
            this.snackBarService.error('Pedido não encontrado');
            this.router.navigate(['orders']);
          }
          this.updateOrder(order);
        });

      this.title = 'Editar pedido';
    }

    this.customerService.get()
      .subscribe(customers => this.customers = customers);

    this.productService.get()
      .subscribe(products => this.products = products);

    this.orderStatusService.get()
      .subscribe(status => this.orderStatus = status);

    this.orderItemStatusService.get()
      .subscribe(itemStatus => this.orderItemStatus = itemStatus);
  }

  add(): void {
    const orderItem = { ...this.orderItem };
    if (!orderItem.product.id || orderItem.itemAmount <= 0)
      return;

    const prevItems = [...this.order.orderItems];
    const orderItems = orderItem.id
      ? prevItems.map(item => item.id === orderItem.id ? { ...orderItem } : item)
      : [...prevItems, orderItem];

    const order: Order = {
      ...this.order,
      orderItems: orderItems,
    }

    if (order.id) {
      this.orderService.update(order)
        .subscribe(orderResponse => {
          this.updateOrder(orderResponse);
        });
    }
    else {
      this.orderService.add(order)
        .subscribe(orderResponse => {
          this.router.navigate([`/order/${orderResponse.id}`])
          // this.updateOrder(orderResponse);
        });
    }
  }

  remove(orderItem: OrderItem): void {
    this.order.orderItems = this.order.orderItems.filter(p => p !== orderItem);
  }

  edit(orderItem: OrderItem): void {
    this.orderItem = { ...orderItem };
    this.orderItem.itemStatus = orderItem.itemStatus;
  }

  update(orderItem: OrderItem, index: number): void {
    this.order.orderItems[index] = orderItem;
  }

  getCurrencyValue = (value: number) =>
    getBrCurrencyStr(value);

  setPrice(value: number) {
    this.orderItem.itemSellingPrice = value;
  }

  setOrderDate(value: Date) {
    this.order.orderDate = value;
  }

  setFirstInstallmentDate(value: Date) {
    this.order.orderDate = value;
  }

  setCustomer(value: Customer) {
    this.order.customer = value;
  }

  setProduct(value: Product) {
    this.orderItem.product = value;
    this.orderItem.itemSellingPrice = value.productPrice;
  }

  setOrderStatus(value: OrderStatus) {
    this.order.status = value;
  }

  setOrderItemStatus(value: OrderItemStatus) {
    this.orderItem.itemStatus = value;
  }

  changeItemStatus(selectEvent: MatSelectChange<string>, orderItemSelected: OrderItem) {
    const optionSelected = this.orderItemStatus.find(x => x.id === selectEvent.value);
    if (!optionSelected)
      return;

    const orderItemChanged = { ...orderItemSelected, itemStatus: optionSelected };
    this.orderItemService.update(orderItemChanged).subscribe(orderItem => {
      const prevItems = [...this.order.orderItems];
      const orderItems = orderItem.id
        ? prevItems.map(item => item.id === orderItem.id ? { ...orderItem } : item)
        : [...prevItems, orderItem];

      this.order.orderItems = orderItems;
    })
  }

  deliveryItem(orderItem: OrderItem) {
    const orderItemChanged = { ...orderItem, deliveryDate: new Date() };
    this.orderItemService.update(orderItemChanged).subscribe(orderItem => {
      const prevItems = [...this.order.orderItems];
      const orderItems = orderItem.id
        ? prevItems.map(item => item.id === orderItem.id ? { ...orderItem } : item)
        : [...prevItems, orderItem];

      this.order.orderItems = orderItems;
    })
  }

  getBrDate(value: Date | null) {
    return value && getBrDateStr(value);
  }

  updateOrder(order: Order) {
    this.orderItem = new OrderItem();
    this.order = { ...order };
    this.orderTotal = getBrCurrencyStr(order.orderItems.reduce((prev, acc) => prev + Number(acc.itemSellingTotal), 0));
  }

  saveOrder(order: Order) {
    this.order = { ...order };
  }

  installmentsManagement() {
    this.dialog.open(InstallmentManagementComponent, {
      width: '1000px',
      data: {
        order: this.order,
        saveOrder: (order: Order) => this.saveOrder(order)
      }
    });
  }


}
