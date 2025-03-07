import { Component, OnInit } from '@angular/core';
import { CustomAutocompleteComponent } from '../custom-autocomplete/custom-autocomplete.component';
import { ProductCategory } from 'src/app/models/product/product-category';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductCategoryService } from 'src/app/services/product-category/product-category.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: false,
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  categories: ProductCategory[] = [];

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  ngOnInit() {
    this.productCategoryService.getProductCategories()
      .subscribe(categories => this.categories = categories);
  }

  setCustomer(value: any) {
    // this.order.customer = value;
  }
}
