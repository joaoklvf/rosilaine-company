import { Component, ElementRef, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  product = new Product();
  products: Product[] = [{ id: 1, title: 'Produto 1', amount: 1, price: 10, total: 10 }];
  @ViewChild("productTitle") myInputField: ElementRef = new ElementRef(null);

  add(): void {
    const product = {
      ...this.product,
      title: this.product.title.trim(),
      price: Number(this.product.price),
      total: this.product.amount * this.product.price
    };
    if (!product.title || product.amount <= 0)
      return;

    this.products.push(product);
    this.product = new Product();
    this.myInputField.nativeElement.focus();
  }

  remove(product: Product): void {
    this.products = this.products.filter(p => p !== product);
  }

  edit(product: Product): void {
    this.product = product;
  }

  update(product: Product, index: number): void {
    this.products[index] = product;
  }

  getCurrencyValue = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  setPrice(value: number) {
    this.product.price = value;
  }
}
