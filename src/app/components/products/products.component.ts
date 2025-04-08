import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductCategory } from 'src/app/models/product/product-category';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductCategoryService } from 'src/app/services/product-category/product-category.service';
import { Product } from 'src/app/models/product/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: false,
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  categories: ProductCategory[] = [];
  products: Product[] = [];
  product = new Product();

  @ViewChild("product-description") productDescriptionField: ElementRef = new ElementRef(null);

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  ngOnInit() {
    this.productCategoryService.getProductCategories()
      .subscribe(categories => this.categories = categories);

    this.productService.getProducts()
      .subscribe(products => this.products = products);
  }

  setProduct(value: Product) {
    this.product = value;
  }

  setCategory(value: ProductCategory) {
    this.product.category = value;
  }

  add() {
    console.log(this.product);
    const product = {
      ...this.product,
      name: this.product.description.trim(),
    };

    if (!product.name || !product.category)
      return;

    if (product.id > 0) {
      this.productService.updateProduct(product)
        .subscribe(product => {
          console.log(product, 'product')
          const customerIndex = this.products.findIndex(c => c.id === product.id);
          this.products[customerIndex] = product;
          this.product = new Product();
        });
    } else {
      this.productService.addProduct(product)
        .subscribe(product => {
          this.products.push(product);
          this.product = new Product();
        });

      this.productDescriptionField.nativeElement.focus();
    }
  }
}
