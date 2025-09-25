import { Component, OnInit, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs";
import { BrDatePickerComponent } from "src/app/components/br-date-picker/br-date-picker.component";
import { CustomAutocompleteComponent } from "src/app/components/custom-autocomplete/custom-autocomplete.component";
import { InputMaskComponent } from "src/app/components/input-mask/input-mask.component";
import { Customer } from "src/app/models/customer/customer";
import { EndCustomer } from "src/app/models/customer/end-customer";
import { Order } from "src/app/models/order/order";
import { OrderInstallment } from "src/app/models/order/order-installment";
import { OrderItem } from "src/app/models/order/order-item/order-item";
import { OrderItemStatus } from "src/app/models/order/order-item/order-item-status";
import { OrderRequest } from "src/app/models/order/order-request";
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
import { getBrCurrencyStr, getBrDateTimeStr, getCustomersNameNickName } from "src/app/utils/text-format";
import { InstallmentsHeaderComponent } from "./components/installments-header/installments-header.component";
import { IInstallmentHeader } from "./components/installments-header/interfaces";
import { InstallmentManagementComponent } from "./components/installments-management/installments-management.component";
import { ItemResponse } from "./interfaces/order-create.interfaces";
import { getError } from "./utils/order-create.utilts";
import { OrderItemsTable } from "./components/order-items-table/order-items-table";

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss',
  imports: [InputMaskComponent, CustomAutocompleteComponent, FormsModule, BrDatePickerComponent, MatSelectModule, MatFormFieldModule, MatIconModule, MatInputModule, InstallmentsHeaderComponent, OrderItemsTable],
})

export class OrderCreateComponent implements OnInit {
  order = model(new Order());
  orderItem = new OrderItem();
  orderTotal = '';
  orderUpdated = '';
  customers: Customer[] = [];
  endCustomers: EndCustomer[] = [];
  products: Product[] = [];
  orderStatuses: OrderStatus[] = [];
  orderItemStatuses: OrderItemStatus[] = [];
  title = 'Cadastrar pedido';
  addUpdateItemButtonText = 'Adicionar';
  endCustomer = model<EndCustomer | null>(null);

  readonly dialog = inject(MatDialog);

  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly orderStatusService: OrderStatusService,
    private readonly route: ActivatedRoute,
    private readonly orderItemStatusService: OrderItemStatusService,
    private readonly orderItemService: OrderItemService,
    private readonly snackBarService: SnackBarService,
    private readonly router: Router,
    private readonly endCustomerService: EndCustomerService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id)
      this.loadOrder(id);

    this.customerService.get({ offset: 0, take: 10 })
      .subscribe(customers => this.customers = getCustomersNameNickName(customers[0]));

    this.productService.get({ offset: 0, take: 10 })
      .subscribe(products => this.products = products[0]);

    this.orderStatusService.get({ offset: 0, take: 10 })
      .subscribe(status => this.orderStatuses = status[0]);

    this.orderItemStatusService.get({ offset: 0, take: 10 })
      .subscribe(itemStatus => this.orderItemStatuses = itemStatus[0]);
  }

  loadOrder(id: string) {
    this.orderService.getById(id)
      .subscribe(order => {
        if (!order) {
          this.snackBarService.error('Pedido não encontrado');
          this.router.navigate(['orders']);
        }

        this.order.set({ ...order })
        this.orderTotal = getBrCurrencyStr(order.total);
        this.orderUpdated = getBrDateTimeStr(order.updatedDate);
        this.getEndCustomers(order.customer.id!)
        this.setEndCustomer(order.endCustomer);
      });

    this.title = 'Editar pedido';
  }

  addUpdateItem(): void {
    const error = getError(this.orderItem, this.order());
    if (error) {
      this.snackBarService.error(error);
      return;
    }

    if (!this.order().id) {
      this.createOrder();
      return;
    }

    if (this.orderItem.id) {
      this.updateItem();
      return;
    }

    this.addItem();
  }

  updateItem(orderItem = this.orderItem) {
    const updateRequest = { ...orderItem, order: this.order() };

    this.orderItemService
      .update(updateRequest)
      .subscribe((addItem) => {
        const response = addItem as unknown as ItemResponse;
        if (!response.orderItem?.id) {
          this.snackBarService.error('Falha ao atualizar produto');
          return;
        }

        this.snackBarService.success(`Produto ${response.orderItem.product?.description} atualizado com sucesso!`);

        const items = this.order().orderItems.map(x => x.id === response.orderItem!.id ? response.orderItem! : x);
        this.saveOrderChanges(response, items);
      });
  }

  addItem() {
    const addRequest = { ...this.orderItem, order: this.order() };

    this.orderItemService
      .add(addRequest)
      .subscribe((updatedItem) => {
        const response = updatedItem as unknown as ItemResponse;
        if (!response.orderItem?.id) {
          this.snackBarService.error('Falha ao adicionar produto');
          return;
        }

        this.snackBarService.success(`Produto ${response.orderItem.product?.description} adicionado com sucesso!`);
        this.saveOrderChanges(response, [...this.order().orderItems, response.orderItem]);
      });
  }

  createOrder() {
    const order: Order = {
      ...this.order(),
      orderItems: [this.orderItem],
    };

    const orderRequest = { ...order, installmentsAmount: 1 };
    this.orderService.add(orderRequest)
      .subscribe(orderResponse => {
        this.router.navigate([`/order/${orderResponse.id}`])
      });
  }

  remove(orderItem: OrderItem): void {
    this.orderItemService.delete(orderItem.id!)
      .subscribe((removedItem) => {
        const response = removedItem as unknown as ItemResponse;
        if (!response) {
          this.snackBarService.error('Falha ao remover produto');
          return;
        }

        this.snackBarService.success(`Produto ${orderItem.product?.description} removido com sucesso!`);
        this.saveOrderChanges(response, this.order().orderItems.filter(item => item.id !== orderItem.id));
      });
  }

  saveOrderChanges(response: ItemResponse, orderItems: OrderItem[]) {
    const order = this.order();

    this.order.set({
      ...order,
      ...response,
      orderItems
    });

    this.orderTotal = getBrCurrencyStr(response.total);
    this.orderUpdated = getBrDateTimeStr(response.updatedDate);
    this.clearItem();
  }

  edit(orderItem: OrderItem): void {
    this.orderItem = { ...orderItem };
    this.orderItem.itemStatus = orderItem.itemStatus;
    this.changeAddUpdateItemButtonText();
  }

  getCurrencyValue = (value: number) =>
    getBrCurrencyStr(value);

  setPrice(value: number | string) {
    const price = Number(value);
    this.orderItem.itemSellingPrice = price;
  }

  setOrderDate(value: Date) {
    this.order().orderDate = value;
  }

  setFirstInstallmentDate(value: Date) {
    this.order().firstInstallmentDate = value;
  }

  setCustomer(customer: Customer | null) {
    if (!customer)
      return;

    this.endCustomer.set(null);
    this.order.set({ ...this.order(), customer, endCustomer: null });
    this.getEndCustomers(customer.id!);

    if (this.order()?.id)
      this.updateOrder();
  }

  setEndCustomer(endCustomer: EndCustomer | null) {
    this.endCustomer.set(endCustomer);
    this.order.set({ ...this.order(), endCustomer });
  }

  setEndCustomerAndSave(endCustomer: EndCustomer | null) {
    if (endCustomer === null)
      return;

    this.setEndCustomer(endCustomer);

    if (this.order()?.id)
      this.updateOrder();
  }

  getEndCustomers(customerId: string) {
    this.order.set({ ...this.order(), endCustomer: null })
    this.endCustomerService.get(customerId, { offset: 0, take: 10 })
      .subscribe(endCustomers => this.endCustomers = endCustomers[0]);
  }

  setProduct(value: Product | null) {
    if (!value?.id) {
      if (this.orderItem.product.id) {
        this.clearItem();
      }
      return;
    }

    this.orderItem.product = { ...value };
    this.orderItem.itemSellingPrice = value.productPrice;
    this.orderItem.itemOriginalPrice = value.productPrice;
  }

  setOrderStatus(status: OrderStatus | null) {
    if (!status)
      return;

    this.order.set({ ...this.order(), status });

    if (this.order()?.id)
      this.updateOrder();
  }

  setOrderItemStatus(value: OrderItemStatus | null) {
    if (value)
      this.orderItem.itemStatus = value;
  }

  getBrDateTime(value?: Date | null) {
    return value && getBrDateTimeStr(value);
  }

  setOrder(order: Order) {
    this.order.set({ ...order });
  }

  installmentsManagement() {
    this.dialog.open(InstallmentManagementComponent, {
      width: '1000px',
      data: {
        order: this.order(),
        saveInstallmentsAction: (installments: OrderInstallment[]) => this.order.set({ ... this.order(), installments }),
        saveOrderAction: (updatedOrder: Order) => this.order.set({ ...updatedOrder }),
      }
    });
  }

  print() {
    sessionStorage.setItem('order', JSON.stringify(this.order()))
    this.router.navigate(['/orders/print'])
  }

  clearItem() {
    this.orderItem = new OrderItem();
    this.changeAddUpdateItemButtonText();
  }

  changeAddUpdateItemButtonText() {
    this.addUpdateItemButtonText = this.orderItem.id ?
      'Atualizar' : 'Adicionar';
  }

  updateOrder() {
    this.orderService.update(this.order())
      .subscribe((updatedOrder) => {
        if (!updatedOrder) {
          this.snackBarService.error('Falha ao atualizar pedido');
          return;
        }

        this.snackBarService.success('Pedido atualizado com sucesso');
        this.orderTotal = getBrCurrencyStr(updatedOrder.total);
        this.orderUpdated = getBrDateTimeStr(updatedOrder.updatedDate);
      })
  }

  saveOrderButtonClick() {
    this.updateOrder();
    this.router.navigate(['/orders'])
  }

  saveInstallmentsChanges(params: IInstallmentHeader) {
    const orderRequest: OrderRequest = {
      ...this.order(),
      ...params
    };

    this.orderService.recreateInstallments(orderRequest).subscribe(installments => {
      this.snackBarService.success('Parcelas atualizadas com sucesso!');
      this.order.set(({ ...orderRequest, installments, isRounded: orderRequest.isToRound! }));
    });
  }

  filterEndCustomers(value: string | EndCustomer | null) {
    let name = '';
    if (typeof value === 'string')
      name = value;
    else if (value !== null)
      name = value.name;

    this.endCustomerService.get(this.order().customer.id!, { name, offset: 0, take: 10 })
      .pipe(
        map(([value]) =>
          value.length ?
            value : [{ name: `Criar ${name}` } as EndCustomer]
        )
      )
      .subscribe(endCustomers => this.endCustomers = endCustomers);
  }

  filterStatus(value: string | OrderStatus | null) {
    let description = '';
    if (typeof value === 'string')
      description = value;
    else if (value !== null)
      description = value.description;

    this.orderStatusService.get({ description, offset: 0, take: 10 })
      .pipe(
        map(([value]) =>
          value.length ?
            value : [{ description: `Criar ${description}` } as OrderStatus]
        )
      )
      .subscribe(orderStatuses => this.orderStatuses = orderStatuses);
  }

  filterCustomers(value: string | Customer | null) {
    let name = '';
    if (typeof value === 'string')
      name = value;
    else if (value !== null)
      name = value.name;

    this.customerService.get({ name, offset: 0, take: 10 })
      .pipe(
        map(([value]) => value)
      )
      .subscribe(customers => this.customers = getCustomersNameNickName(customers));
  }

  filterProducts(value: string | Product | null) {
    let description = '';
    let productCode = '';
    if (typeof value === 'string') {
      const strNumber = Number(value);
      if (Number.isNaN(strNumber))
        description = value;
      else
        productCode = value;
    }
    else if (value !== null)
      description = value.description;

    this.productService.get({ description, productCode, offset: 0, take: 10 })
      .pipe(
        map(([value]) => value)
      )
      .subscribe(products => this.products = products);
  }

  filterItemStatus(value: string | OrderItemStatus | null) {
    let description = '';
    if (typeof value === 'string')
      description = value;
    else if (value !== null)
      description = value.description;

    this.orderItemStatusService.get({ description, offset: 0, take: 10 })
      .pipe(
        map(([value]) =>
          value.length ?
            value : [{ description: `Criar ${description}` } as OrderItemStatus]
        )
      )
      .subscribe(orderItemStatuses => this.orderItemStatuses = orderItemStatuses);
  }
}
