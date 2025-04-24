import { BaseEntity } from "../base-entity";
import { Product } from "../product/product";

export class Stock extends BaseEntity {
  description = '';
  stockProducts: Product[] = [];
}