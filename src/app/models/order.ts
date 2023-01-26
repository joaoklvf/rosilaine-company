import { Customer } from "./customer";
import { Product } from "./product";

export class Order {
  id = 0;
  customer = new Customer();
  products: Product[] = [];
  orderDate = new Date();
}