import { Component, OnInit, ViewChild, ElementRef, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { CustomAutocompleteComponent } from "src/app/components/custom-autocomplete/custom-autocomplete.component";
import { CustomDialogComponent } from "src/app/components/custom-dialog/custom-dialog.component";
import { InputMaskComponent } from "src/app/components/input-mask/input-mask.component";
import { Product } from "src/app/models/product/product";
import { ProductCategory } from "src/app/models/product/product-category";
import { ProductCategoryService } from "src/app/services/product/product-category/product-category.service";
import { ProductService } from "src/app/services/product/product.service";
import { getBrCurrencyStr } from "src/app/utils/text-format";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  imports: [InputMaskComponent, CustomAutocompleteComponent, FormsModule, MatIconModule]
})

export class ProductsComponent implements OnInit {
  categories: ProductCategory[] = [];
  products: Product[] = [];
  product = new Product();

  @ViewChild("productDescription") productDescriptionField: ElementRef = new ElementRef(null);

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }
  readonly dialog = inject(MatDialog);

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

    if (product.id) {
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
    getBrCurrencyStr(value);

  deleteProduct(product: Product) {
    this.productService.update({ ...product, isDeleted: true })
      .subscribe(productUpdated => {
        if (!productUpdated)
          return;

        const products = this.products.filter(x => x.id !== product.id);
        this.products = [...products];
      });
  }

  openDialog(product: Product): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar produto",
        content: `Deseja deletar o produto ${product.description}?`,
        onConfirmAction: () => this.deleteProduct(product)
      }
    });
  }
}
