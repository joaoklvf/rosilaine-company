import { Component, ElementRef, ViewChild } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
    standalone: false
})
export class OrderComponent {
  order = new Order();
  product = new Product();

  @ViewChild("productDescription") myInputField: ElementRef = new ElementRef(null);

  constructor(private orderService: OrderService) { }
  add(): void {
    const product = {
      ...this.product,
      description: this.product.description.trim(),
      price: Number(this.product.price),
      total: this.product.amount * this.product.price
    };
    if (!product.description || product.amount <= 0)
      return;

    const productsToAdd = [...this.order.products, product];
    const order: Order = {
      ...this.order,
      products: productsToAdd,
    }

    if (order.id > 0) {
      this.orderService.updateOrder(order)
        .subscribe(orderResponse => {
          this.order = orderResponse;
          this.product = new Product();
        });
    } else {
      this.orderService.addOrder(order)
        .subscribe(orderResponse => {
          this.order = orderResponse;
          this.product = new Product();
        });
      this.myInputField.nativeElement.focus();
    }

    this.order.products.push(product);
    this.product = new Product();
    this.myInputField.nativeElement.focus();
  }

  remove(product: Product): void {
    this.order.products = this.order.products.filter(p => p !== product);
  }

  edit(product: Product): void {
    this.product = { ...product };
  }

  update(product: Product, index: number): void {
    this.order.products[index] = product;
  }

  getCurrencyValue = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  setPrice(value: number) {
    this.product.price = value;
  }

  setOrderDate(value: Date) {
    this.order.orderDate = value;
  }

  setCustomer(value: any) {
    this.order.customer = value;
  }
}
