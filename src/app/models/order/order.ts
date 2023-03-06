import { Customer } from "../customer/customer";
import { OrderInstallment } from "./order-installments";
import { OrderItem } from "./order-item";
import { OrderStatus } from "./order-status";

export class Order {
  id: number = 0;
  deliveryDate: Date = new Date();
  total: number = 0;
  customer: Customer = new Customer();
  status: OrderStatus = new OrderStatus();
  orderItems: OrderItem[] = [];
  installments: OrderInstallment[] = [];
  createdDate: Date = new Date();
}