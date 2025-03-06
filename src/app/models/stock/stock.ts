import { Product } from "../product/product";

export class Stock {
  id = 0;
  description = '';
  createdDate = new Date();
  updatedDate = new Date();
  stockProducts: Product[] = [];
}