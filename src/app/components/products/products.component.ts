import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductCategory } from 'src/app/models/product/product-category';
import { ProductService } from 'src/app/services/product/product.service';
import { Product } from 'src/app/models/product/product';
import { getCurrencyStrBr } from 'src/app/utils/text-format';
import { ProductCategoryService } from 'src/app/services/product/product-category/product-category.service';

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

  @ViewChild("productDescription") productDescriptionField: ElementRef = new ElementRef(null);

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  ngOnInit() {
    this.productCategoryService.get()
      .subscribe(categories => this.categories = categories);

    this.productService.get()
      .subscribe(products => this.products = products);
  }

  setProduct(value: Product) {
    this.product = value;
  }

  setCategory(value: ProductCategory) {
    this.product.category = value;
  }

  setPrice(value: number) {
    this.product.productPrice = value;
  }

  add() {
    const product = {
      ...this.product,
      name: this.product.description.trim(),
    };

    if (!product.name || !product.category)
      return;

    if (product.id > 0) {
      this.productService.update(product)
        .subscribe(product => {
          const customerIndex = this.products.findIndex(c => c.id === product.id);
          this.products[customerIndex] = product;
          this.product = new Product();
        });
    } else {
      this.productService.add(product)
        .subscribe(product => {
          this.products.push(product);
          this.product = new Product();
        });

      this.productDescriptionField.nativeElement.focus();
    }
  }

  edit(product: Product): void {
    this.product = { ...product };
  }

  getCurrencyValue = (value: number) =>
    getCurrencyStrBr(value);
}
