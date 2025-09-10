import { Component, ElementRef, inject, input, model, OnChanges, OnInit, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { CustomAutocompleteComponent } from 'src/app/components/custom-autocomplete/custom-autocomplete.component';
import { InputMaskComponent } from 'src/app/components/input-mask/input-mask.component';
import { Product } from 'src/app/models/product/product';
import { ProductCategory } from 'src/app/models/product/product-category';
import { ProductCategoryService } from 'src/app/services/product/product-category/product-category.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-product-create',
  imports: [InputMaskComponent, CustomAutocompleteComponent, FormsModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent implements OnInit, OnChanges {
  constructor(
    private readonly productService: ProductService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly snackBarService: SnackBarService,
  ) { }
  readonly dialog = inject(MatDialog);
  readonly products = input<Product[]>([]);
  readonly product = input.required<Product>();
  readonly modelProduct = model<Product>();
  readonly editProduct = input<Product>();
  readonly saveProductAction = output<Product>();
  readonly dataCount = input(0);
  categories: ProductCategory[] = [];
  addUpdateButtonText = 'Adicionar';
  @ViewChild("productDescription") productDescriptionField: ElementRef = new ElementRef(null);

  ngOnChanges() {
    this.addUpdateButtonText = this.product().id ? 'Atualizar' : 'Adicionar';
    this.modelProduct.set({ ...this.product() });
  }

  ngOnInit(): void {
    this.productCategoryService.get({ offset: 0, take: 10 })
      .subscribe(categories => this.categories = categories[0]);
  }

  setCategory(value: ProductCategory | null) {
    if (value)
      this.modelProduct.set({ ...this.modelProduct()!, category: value });
  }

  setPrice(value: number) {
    this.modelProduct.set({ ...this.modelProduct()!, productPrice: value });
  }

  filterCategories(value: string | ProductCategory | null) {
    let description = '';
    if (typeof value === 'string')
      description = value;
    else if (value !== null)
      description = value.description;

    this.productCategoryService.get({ description, offset: 0, take: 10 })
      .pipe(
        map(([value]) =>
          value.length ?
            value : [{ description: `Criar ${description}` } as ProductCategory]
        )
      )
      .subscribe(categories => this.categories = categories);
  }

  getError() {
    const product = { ...this.modelProduct()! };
    if (!product.description)
      return 'Preencha a descrição do produto';

    if (!product.category.description)
      return 'Defina a categoria do produto';

    if (product.productPrice <= 0)
      return 'Informe o valor do produto'

    return null;
  }

  add() {
    const error = this.getError();
    if (error) {
      this.snackBarService.error(error);
      return;
    }

    const product: Product = {
      ...this.modelProduct()!,
      description: this.modelProduct()!.description.trim(),
    };

    if (product.id)
      this.productService.update(product)
        .subscribe(product => this.afterRequest(product));

    else
      this.productService.add(product)
        .subscribe(product => this.afterRequest(product));
  }

  afterRequest(product: Product) {
    if (product.id) {
      this.snackBarService.success(`Produto ${product.description} atualizado com sucesso!`);
    }
    else {
      this.snackBarService.success(`Produto ${product.description} criado com sucesso!`);
    }
    this.saveProductAction.emit(product);
  }

  onDescriptionInput(target: any) {
    target.value = target.value.charAt(0).toUpperCase() + target.value.slice(1);
  }
}
