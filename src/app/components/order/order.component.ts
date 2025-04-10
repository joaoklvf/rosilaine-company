import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer/customer';
import { Order } from 'src/app/models/order/order';
import { OrderItem } from 'src/app/models/order/order-item';
import { Product } from 'src/app/models/product/product';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: false
})
export class OrderComponent implements OnInit {
  order = new Order();
  orderItem = new OrderItem();

  customers: Customer[] = [];
  products: Product[] = [];

  constructor(private orderService: OrderService, private customerService: CustomerService, private productService: ProductService) { }

  ngOnInit() {
    this.customerService.getCustomers()
      .subscribe(customers => this.customers = customers);

    this.productService.getProducts()
    .subscribe(products => this.products = products);
  }

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
    }

    this.order.orderItems.push(orderItem);
    this.orderItem = new OrderItem();
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

  setCustomer(value: Customer) {
    this.order.customer = value;
  }

  setProduct(value: Product) {
    this.orderItem.product = value;
  }
}
