import { Stock } from "../stock/stock";
import { Product } from "./product";

export class ProductStock {
  id = 0;
  quantity = 0;
  minQuantity = 0;
  product = new Product();
  stock = new Stock();
}