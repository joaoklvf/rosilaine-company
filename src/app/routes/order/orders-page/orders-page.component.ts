import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { Order } from 'src/app/models/order/order';
import { OrderService } from 'src/app/services/order/order.service';
import { getBrDateStr } from 'src/app/utils/text-format';
import { DataTableComponent } from "../../../components/data-table/data-table.component";
import { DataTableColumnProp, FormatValueOptions } from 'src/app/interfaces/data-table';
import { CustomAutocompleteComponent } from 'src/app/components/custom-autocomplete/custom-autocomplete.component';
import { Customer } from 'src/app/models/customer/customer';
import { OrderStatus } from 'src/app/models/order/order-status';
import { OrderSearchFilter } from 'src/app/interfaces/order-filter';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { OrderStatusService } from 'src/app/services/order/order-status/order-status.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-orders-page',
  imports: [RouterModule, DataTableComponent, CustomAutocompleteComponent],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss'
})

export class OrdersPageComponent implements OnInit {
  orders: Order[] = [];
  readonly dialog = inject(MatDialog);
  readonly columns: DataTableColumnProp<Order>[] = [
    { description: "Cliente", fieldName: "customer.name", width: '50%' },
    { description: "Data do pedido", fieldName: "orderDate", formatValue: FormatValueOptions.Date },
    { description: "Status", fieldName: "status.description" },
  ]
  customers: Customer[] = [];
  orderStatuses: OrderStatus[] = [];
  customer: Customer | null = null;
  status: OrderStatus | null = null;

  constructor(private orderService: OrderService, private customerService: CustomerService, private orderStatusService: OrderStatusService, private router: Router) { }

  ngOnInit() {
    this.getOrders();

    this.orderStatusService.get()
      .subscribe(status => this.orderStatuses = status);

    this.customerService.get()
      .subscribe(customers => this.customers = customers);
  }

  getOrders() {
    let params = new HttpParams();

    if (this.customer?.id)
      params = params.set('customerId', this.customer.id)

    if (this.status?.id)
      params = params.set('statusId', this.status.id)

    this.orderService.get(params)
      .subscribe(orders => this.orders = orders);
  }

  clearFilters() {
    this.setCustomer(null);
    this.setOrderStatus(null);
    this.getOrders();
  }

  deleteOrder(id: string) {
    this.orderService.delete(id).subscribe(response => {
      if (response.affected)
        this.orders = this.orders.filter(x => x.id !== id);
    })
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
        onConfirmAction: () => this.deleteOrder(order.id!)
      }
    });
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
}