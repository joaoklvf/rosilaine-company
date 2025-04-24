import { Product } from "../../product/product";
import { OrderItemStatus } from "./order-item-status";

export class OrderItem {
  id = 0;
  itemAmount = 0;
  itemSellingTotal = 0;
  itemSellingPrice = 0;
  itemOriginalPrice = 0;
  product = new Product();
  itemStatus = new OrderItemStatus();
}
