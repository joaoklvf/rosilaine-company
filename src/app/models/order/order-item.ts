import { Product } from "../product/product";

export class OrderItem {
  id = 0;
  itemAmount = 0;
  itemPrice = 0;
  itemTotal = 0;
  itemDiscount?: number;
  itemSellingPrice = 0;
  product = new Product();
}
