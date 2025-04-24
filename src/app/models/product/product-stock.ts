import { BaseEntity } from "../base-entity";
import { Stock } from "../stock/stock";
import { Product } from "./product";

export class ProductStock extends BaseEntity {
  quantity = 0;
  minQuantity = 0;
  product = new Product();
  stock = new Stock();
}