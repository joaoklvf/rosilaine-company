import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { Order } from 'src/app/models/order/order';
import { OrderService } from 'src/app/services/order/order.service';
import { getBrDateStr } from 'src/app/utils/text-format';
import { DataTableComponent } from "../../../components/data-table/data-table.component";
import { ColumnProp, FormatValueOptions } from 'src/app/interfaces/data-table';

@Component({
  selector: 'app-orders-page',
  imports: [RouterModule, DataTableComponent],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss'
})

export class OrdersPageComponent implements OnInit {
  orders: Order[] = [];
  readonly dialog = inject(MatDialog);
  readonly columns: ColumnProp<Order>[] = [
    { description: "Cliente", fieldName: "customer.name", width: '50%' },
    { description: "Data do pedido", fieldName: "orderDate", formatValue: FormatValueOptions.Date },
    { description: "Status", fieldName: "status.description" },
  ]

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit() {
    this.orderService.get()
      .subscribe(orders => this.orders = orders);
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
}