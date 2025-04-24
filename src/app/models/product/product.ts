import { BaseEntity } from "../base-entity";
import { ProductCategory } from "./product-category";

export class Product extends BaseEntity {
  description = '';
  productPrice = 0;
  productCode? = '';
  category = new ProductCategory();
  isDeleted = false;
}
