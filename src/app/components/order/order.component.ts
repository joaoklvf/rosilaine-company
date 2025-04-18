import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order/order';
import { OrderService } from 'src/app/services/order/order.service';
import { getDateStrBr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: false
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.get()
      .subscribe(orders => this.orders = orders);
  }

  remove(id: number) {
    alert('ainda não implementado')
  }

  getBrDate(value: Date) {
    return getDateStrBr(value);
  }
}