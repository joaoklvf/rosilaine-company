import { Product } from "../product/product";

export class OrderItem {
  quantity: number = 0;
  originalPrice: number = 0;
  discount?: number;
  sellingPrice: number = 0;
  productId: number = 0;
  orderId: number = 0;
  product: Product = new Product();
  total: number = this.sellingPrice * this.sellingPrice;
}
