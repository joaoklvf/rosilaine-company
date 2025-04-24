import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer/customer';
import { Order } from '../../models/order/order';
import { OrderItem } from '../../models/order/order-item/order-item';
import { OrderStatus } from '../../models/order/order-status';
import { Product } from '../../models/product/product';
import { CustomerService } from '../../services/customer/customer.service';
import { OrderStatusService } from '../../services/order/order-status/order-status.service';
import { OrderService } from '../../services/order/order.service';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { getCurrencyStrBr } from 'src/app/utils/text-format';
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';
import { OrderItemStatusService } from 'src/app/services/order/order-item-status/order-item-status.service';
import { MatSelectChange } from '@angular/material/select';
import { OrderItemService } from 'src/app/services/order/order-item/order-item.service';

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
  orderItemStatus: OrderItemStatus[] = [];
  title = 'Cadastrar pedido'
  constructor(private orderService: OrderService, private customerService: CustomerService, private productService: ProductService, private orderStatusService: OrderStatusService, private route: ActivatedRoute, private orderItemStatusService: OrderItemStatusService, private orderItemService: OrderItemService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
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

    this.orderItemStatusService.get()
      .subscribe(itemStatus => this.orderItemStatus = itemStatus);
  }

  add(): void {
    const orderItem = { ...this.orderItem };
    if (!orderItem.product.id || orderItem.itemAmount <= 0)
      return;

    const prevItems = [...this.order.orderItems];
    const orderItems = orderItem.id
      ? prevItems.map(item => item.id === orderItem.id ? { ...orderItem } : item)
      : [...prevItems, orderItem];

    const order: Order = {
      ...this.order,
      orderItems: orderItems,
    }

    if (order.id) {
      this.orderService.update(order)
        .subscribe(orderResponse => {
          this.orderItem = new OrderItem();
          this.order = { ...orderResponse };
        });
    }
    else {
      this.orderService.add(order)
        .subscribe(orderResponse => {
          this.orderItem = new OrderItem();
          this.order = { ...orderResponse };
        });
    }
  }

  remove(orderItem: OrderItem): void {
    this.order.orderItems = this.order.orderItems.filter(p => p !== orderItem);
  }

  edit(orderItem: OrderItem): void {
    this.orderItem = { ...orderItem };
    this.orderItem.itemStatus = orderItem.itemStatus;
  }

  update(orderItem: OrderItem, index: number): void {
    this.order.orderItems[index] = orderItem;
  }

  getCurrencyValue = (value: number) =>
    getCurrencyStrBr(value);

  setPrice(value: number) {
    this.orderItem.itemSellingPrice = value;
  }

  setOrderDate(value: Date) {
    this.order.orderDate = value;
  }

  setCustomer(value: Customer) {
    this.order.customer = value;
  }

  setProduct(value: Product) {
    this.orderItem.product = value;
    this.orderItem.itemSellingPrice = value.productPrice;
  }

  setOrderStatus(value: OrderStatus) {
    this.order.status = value;
  }

  setOrderItemStatus(value: OrderItemStatus) {
    this.orderItem.itemStatus = value;
  }

  changeItemStatus(selectEvent: MatSelectChange<string>, orderItemSelected: OrderItem) {
    const optionSelected = this.orderItemStatus.find(x => x.id === selectEvent.value);
    if (!optionSelected)
      return;

    const orderItemChanged = { ...orderItemSelected, itemStatus: optionSelected };
    this.orderItemService.update(orderItemChanged).subscribe(orderItem => {
      const prevItems = [...this.order.orderItems];
      const orderItems = orderItem.id
        ? prevItems.map(item => item.id === orderItem.id ? { ...orderItem } : item)
        : [...prevItems, orderItem];

      this.order.orderItems = orderItems;
    })
  }
}
