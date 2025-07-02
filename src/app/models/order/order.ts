import { BaseEntity } from "../base-entity";
import { Customer } from "../customer/customer";
import { EndCustomer } from "../customer/end-customer";
import { OrderInstallment } from "./order-installment";
import { OrderItem } from "./order-item/order-item";
import { OrderStatus } from "./order-status";

export class Order extends BaseEntity {
  total = 0;
  orderDate = new Date();
  customer = new Customer();
  status = new OrderStatus();
  deliveryDate: Date | null = null;
  firstInstallmentDate: Date | null = null;
  orderItems: OrderItem[] = [];
  installments?: OrderInstallment[];
  endCustomer?: EndCustomer;
}