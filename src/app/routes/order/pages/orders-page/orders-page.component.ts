import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { Order } from 'src/app/models/order/order';
import { OrderService } from 'src/app/services/order/order.service';
import { getBrDateStr, getCustomerNameNickName, getCustomersNameNickName } from 'src/app/utils/text-format';
import { DataTableColumnProp, FormatValueOptions } from 'src/app/interfaces/data-table';
import { CustomAutocompleteComponent } from 'src/app/components/custom-autocomplete/custom-autocomplete.component';
import { Customer } from 'src/app/models/customer/customer';
import { OrderStatus } from 'src/app/models/order/order-status';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { OrderStatusService } from 'src/app/services/order/order-status/order-status.service';
import { HttpParams } from '@angular/common/http';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { tap, catchError, of, map } from 'rxjs';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';

@Component({
  selector: 'app-orders-page',
  imports: [RouterModule, DataTableComponent, CustomAutocompleteComponent],
  templateUrl: './orders-page.component.html',
})

export class OrdersPageComponent implements OnInit {
  orders: Order[] = [];
  readonly dialog = inject(MatDialog);
  readonly columns: DataTableColumnProp<Order>[] = [
    { description: "Cliente", fieldName: "customer.name", width: '20%' },
    { description: "Cliente final", fieldName: "endCustomer.name", width: '20%' },
    { description: "Valor", fieldName: 'total', formatValue: FormatValueOptions.Currency },
    { description: "Data do pedido", fieldName: "orderDate", formatValue: FormatValueOptions.Date },
    { description: "Status", fieldName: "status.description" },
  ]
  customers: Customer[] = [];
  orderStatuses: OrderStatus[] = [];
  customer: Customer | null = null;
  status: OrderStatus | null = null;
  dataCount = 0;

  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    private readonly orderStatusService: OrderStatusService,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.getOrders();

    this.orderStatusService.get({ offset: 0, take: 10 })
      .subscribe(status => this.orderStatuses = status[0]);

    this.customerService.get({ offset: 0, take: 10 })
      .subscribe(customers => this.customers = getCustomersNameNickName(customers[0]));
  }

  getOrders() {
    let params = new HttpParams();

    if (this.customer?.id)
      params = params.set('customerId', this.customer.id)

    if (this.status?.id)
      params = params.set('statusId', this.status.id)

    this.orderService.get(params)
      .subscribe(orders => {
        this.orders = orders[0].map(order => ({ ...order, customer: getCustomerNameNickName(order.customer) }));
        this.dataCount = orders[1];
      });
  }

  clearFilters() {
    const hasAnyFilter = this.customer?.id || this.status?.id;
    this.setCustomer(null);
    this.setOrderStatus(null);

    if (hasAnyFilter)
      this.getOrders();
  }

  getBrDate(value: Date) {
    return getBrDateStr(value);
  }

  openDialog(order: Order): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar pedido",
        content: `Deseja deletar o pedido?`,
        onConfirmAction: () => this.deleteOrderById(order.id!)
      }
    });
  }

  deleteOrderById(id: string) {
    this.orderService.safeDelete(id)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Pedido deletado com sucesso');
          this.getOrders();
        }),
        catchError(() => of(this.snackBarService.error('Falha ao deletar pedido')))
      )
      .subscribe();
  }

  edit(value: Order) {
    this.router.navigate([`/order/${value.id}`])
  }

  addPageNavigate() {
    this.router.navigate(["/orders/create"])
  }

  setOrderStatus(value: OrderStatus | null) {
    this.status = value;
  }

  setCustomer(value: Customer | null) {
    this.customer = value;
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

  filterStatus(value: string | OrderStatus | null) {
    let description = '';
    if (typeof value === 'string')
      description = value;
    else if (value !== null)
      description = value.description;

    this.orderStatusService.get({ description, offset: 0, take: 10 })
      .pipe(
        map(([value]) => value)
      )
      .subscribe(orderStatuses => this.orderStatuses = orderStatuses);
  }
}