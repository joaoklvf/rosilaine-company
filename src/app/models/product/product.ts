import { ProductCategory } from "./product-category";

export class Product {
  id = 0;
  description = '';
  productCode? = '';
  createdDate = new Date();
  updatedDate = new Date();
  category = new ProductCategory();
}
