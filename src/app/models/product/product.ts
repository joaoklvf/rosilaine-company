import { ProductCategory } from "./product-category";

export class Product {
  id: number = 0;
  description: string = '';
  price: number = 0;
  productCode?: string;
  category: ProductCategory = new ProductCategory();
}
