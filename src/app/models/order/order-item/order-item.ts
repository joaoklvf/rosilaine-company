import { Product } from "../../product/product";
import { OrderItemStatus } from "./order-item-status";

export class OrderItem {
  id = 0;
  itemAmount = 0;
  itemPrice = 0;
  itemTotal = 0;
  itemDiscount?: number;
  itemSellingPrice = 0;
  product = new Product();
  status = new OrderItemStatus();
}
