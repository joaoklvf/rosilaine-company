import { Customer } from "../models/customer/customer";

export interface OrderItemByStatus {
  amount: number;
  statusDescription: string;
  statusId: string;
  productId: string;
  productDescription: string;
  productCode: string;
}

export interface OrderItemByCustomer {
  customer: Customer;
  items: OrderItemByStatus[]
}
