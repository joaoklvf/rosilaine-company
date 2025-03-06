import { Component, ElementRef, ViewChild } from '@angular/core';
import { Order } from 'src/app/models/order/order';
import { OrderItem } from 'src/app/models/order/order-item';
import { Product } from 'src/app/models/product/product';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: false
})
export class OrderComponent {
  order = new Order();
  orderItem = new OrderItem();

  @ViewChild("productDescription") myInputField: ElementRef = new ElementRef(null);

  constructor(private orderService: OrderService) { }
  add(): void {

    const orderItem = {
      ...this.orderItem,
      description: this.orderItem.product.description.trim(),
      price: Number(this.orderItem.itemPrice),
      total: this.orderItem.itemPrice * this.orderItem.itemAmount
    };

    if (!orderItem.product.description || orderItem.itemAmount <= 0)
      return;

    const orderItems = [...this.order.orderItems, orderItem];
    const order: Order = {
      ...this.order,
      orderItems: orderItems,
    }

    if (order.id > 0) {
      this.orderService.updateOrder(order)
        .subscribe(orderResponse => {
          this.order = orderResponse;
          this.orderItem = new OrderItem();
        });
    } else {
      this.orderService.addOrder(order)
        .subscribe(orderResponse => {
          this.order = orderResponse;
          this.orderItem = new OrderItem();
        });
      this.myInputField.nativeElement.focus();
    }

    this.order.orderItems.push(orderItem);
    this.orderItem = new OrderItem();
    this.myInputField.nativeElement.focus();
  }

  remove(orderItem: OrderItem): void {
    this.order.orderItems = this.order.orderItems.filter(p => p !== orderItem);
  }

  edit(orderItem: OrderItem): void {
    this.orderItem = { ...orderItem };
  }

  update(orderItem: OrderItem, index: number): void {
    this.order.orderItems[index] = orderItem;
  }

  getCurrencyValue = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  setPrice(value: number) {
    this.orderItem.itemPrice = value;
  }

  setOrderDate(value: Date) {
    this.order.orderDate = value;
  }

  setCustomer(value: any) {
    this.order.customer = value;
  }
}
