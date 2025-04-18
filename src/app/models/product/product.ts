import { ProductCategory } from "./product-category";

export class Product {
  id = 0;
  description = '';
  productPrice = 0;
  productCode? = '';
  createdDate = new Date();
  updatedDate = new Date();
  category = new ProductCategory();
  isDeleted = false;
}
