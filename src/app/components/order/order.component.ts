import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormatOptions } from 'src/app/interfaces/format';
import { Customer } from 'src/app/models/customer/customer';
import { Order } from 'src/app/models/order/order';
import { OrderItem } from 'src/app/models/order/order-item';
import { Product } from 'src/app/models/product/product';
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
  orderItem = new OrderItem();
  customers: Customer[] = [];
  databaseProducts: Product[] = [];
  columnsProps: ColumnProps<OrderItem>[] = [
    { key: 'product', label: 'Produto' },
    { key: 'quantity', label: 'Quantidade' },
    { key: 'sellingPrice', label: 'Preço', formatOption: FormatOptions.Currency },
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
    const product: OrderItem = { ...this.orderItem };

    const productsToAdd = [...this.order.orderItems, product];
    const order: Order = {
      ...this.order,
      orderItems: productsToAdd,
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

    this.myInputField.nativeElement.focus();
  }

  remove(item: OrderItem): void {
    this.order.orderItems.splice(this.order.orderItems.indexOf(item), 1);
  }

  edit(item: OrderItem): void {
    this.orderItem = { ...item };
  }

  update(item: OrderItem, index: number): void {
    this.order.orderItems[index] = item;
  }

  getCurrencyValue = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  setPrice(value: number) {
    this.orderItem.sellingPrice = value;
  }

  setOrderDate(value: Date) {
    this.order.deliveryDate = value;
  }

  setCustomer(customer: Customer) {
    this.order.customer = customer;
  }

  setProduct(product: Product) {
    this.orderItem.product = product;
  }
}
