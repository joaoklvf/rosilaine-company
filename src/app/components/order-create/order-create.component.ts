import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer/customer';
import { Order } from '../../models/order/order';
import { OrderItem } from '../../models/order/order-item';
import { OrderStatus } from '../../models/order/order-status';
import { Product } from '../../models/product/product';
import { CustomerService } from '../../services/customer/customer.service';
import { OrderStatusService } from '../../services/order-status/order-status.service';
import { OrderService } from '../../services/order/order.service';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { getCurrencyStrBr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss',
  standalone: false
})
export class OrderCreateComponent implements OnInit {
  order = new Order();
  orderItem = new OrderItem();

  customers: Customer[] = [];
  products: Product[] = [];
  orderStatus: OrderStatus[] = [];
  title = 'Cadastrar pedido'
  constructor(private orderService: OrderService, private customerService: CustomerService, private productService: ProductService, private orderStatusService: OrderStatusService, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    if (id) {
      this.orderService.getById(id)
        .subscribe(order => this.order = { ...order });

      this.title = 'Editar pedido';
    }
    
    this.customerService.get()
      .subscribe(customers => this.customers = customers);

    this.productService.get()
      .subscribe(products => this.products = products);

    this.orderStatusService.get()
      .subscribe(status => this.orderStatus = status);
  }

  add(): void {
    // Desenvolvimento prévio até implementar preço de venda
    const total = this.orderItem.itemPrice * this.orderItem.itemAmount;

    const orderItem: OrderItem = {
      ...this.orderItem,
      itemTotal: total,
      itemSellingPrice: total
    };

    if (!orderItem.product.description || orderItem.itemAmount <= 0)
      return;

    const orderItems = [...this.order.orderItems, orderItem];
    const order: Order = {
      ...this.order,
      orderItems: orderItems,
    }

    if (order.id > 0) {
      this.orderService.update(order)
        .subscribe(orderResponse => {
          this.order = orderResponse;
          this.orderItem = new OrderItem();
        });
    } else {
      this.orderService.add(order)
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
    getCurrencyStrBr(value);

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
    this.orderItem.itemPrice = value.productPrice;
  }

  setOrderStatus(value: OrderStatus) {
    this.order.status = value;
  }
}
