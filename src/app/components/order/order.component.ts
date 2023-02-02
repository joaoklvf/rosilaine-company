import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormatOptions } from 'src/app/interfaces/format';
import { Customer } from 'src/app/models/customer';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ColumnProps } from '../generic-list/interfaces';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  order = new Order();
  product = new Product();
  customers: Customer[] = [];
  databaseProducts: Product[] = [];
  columnsProps: ColumnProps<Product>[] = [
    { key: 'description', label: 'Produto' },
    { key: 'amount', label: 'Quantidade' },
    { key: 'price', label: 'Preço', formatOption: FormatOptions.Currency },
    { key: 'total', label: 'Total', formatOption: FormatOptions.Currency },
  ];
  @ViewChild("productDescription") myInputField: ElementRef = new ElementRef(null);

  constructor(private orderService: OrderService, private customerService: CustomerService, private productService: ProductService) { }

  ngOnInit() {
    this.customerService.getCustomers()
      .subscribe(customers => this.customers = customers);
    this.productService.getProducts()
      .subscribe(products => this.databaseProducts = products);
  }

  getOptionLabelCustomer(customer: Customer | null) {
    return customer?.name || '';
  }

  getOptionLabelProduct(customer: Product | null) {
    return customer?.description || '';
  }

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

  setCustomer(customer: Customer) {
    this.order.customer = customer;
  }

  setProduct(product: Product) {
    this.product = product;
  }
}
