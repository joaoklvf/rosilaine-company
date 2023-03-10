import { Component, ElementRef, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product/product';
import { ProductCategory } from 'src/app/models/product/product-category';
import { ProductCategoryService } from 'src/app/services/product-category/product-category.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ColumnProps } from '../generic-list/interfaces';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  product = new Product();
  databaseProducts: Product[] = [];
  productCategories: ProductCategory[] = [];
  columnsProps: ColumnProps<Product>[] = [
    { key: 'description', label: 'Produto' },
    { key: 'productCode', label: 'Código' },
    { key: 'category.description', label: 'Categoria' }
  ];
  @ViewChild("productDescription") myInputField: ElementRef = new ElementRef(null);


  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  ngOnInit() {
    this.productService.getProducts()
      .subscribe(products => this.databaseProducts = products);
    this.productCategoryService.getProductCategories()
      .subscribe(categories => this.productCategories = categories);
  }


  add(): void {
    const product: Product = { ...this.product };

    if (product.id > 0) {
      this.productService.updateProduct(product)
        .subscribe(productsResponse => {
          this.databaseProducts = productsResponse;
          this.product = new Product();
        });
    } else {
      this.productService.addProduct(product)
        .subscribe(productResponse => {
          this.databaseProducts = [...this.databaseProducts, productResponse];
          this.product = new Product();
        });
    }

    this.myInputField.nativeElement.focus();
  }

  edit(product: Product): void {
    this.product = { ...product };
  }

  remove(product: Product): void {
    this.databaseProducts.splice(this.databaseProducts.indexOf(product), 1);
  }

  setPrice(value: number) {
    this.product.price = value;
  }
}
