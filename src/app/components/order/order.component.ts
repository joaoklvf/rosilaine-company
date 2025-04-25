import { Component, inject, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order/order';
import { OrderService } from 'src/app/services/order/order.service';
import { getDateStrBr } from 'src/app/utils/text-format';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: false
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  readonly dialog = inject(MatDialog);

  constructor(private orderService: OrderService) { }

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
    return getDateStrBr(value);
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
}