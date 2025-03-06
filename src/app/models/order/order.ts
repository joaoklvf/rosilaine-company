import { Customer } from "../customer/customer";
import { OrderInstallment } from "./order-installment";
import { OrderItem } from "./order-item";
import { OrderStatus } from "./order-status";

export class Order {
  id = 0;
  deliveryDate = new Date();
  total = 0;
  createdDate = new Date();
  updatedDate = new Date();
  orderDate = new Date();
  customer = new Customer();
  status = new OrderStatus();
  orderItems: OrderItem[] = [];
  installments: OrderInstallment[] = [];
}