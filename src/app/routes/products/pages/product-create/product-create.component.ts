import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { CustomAutocompleteComponent } from 'src/app/components/custom-autocomplete/custom-autocomplete.component';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { InputMaskComponent } from 'src/app/components/input-mask/input-mask.component';
import { Product } from 'src/app/models/product/product';
import { ProductCategory } from 'src/app/models/product/product-category';
import { ProductCategoryService } from 'src/app/services/product/product-category/product-category.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { getBrCurrencyStr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-product-create',
  imports: [InputMaskComponent, CustomAutocompleteComponent, FormsModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent {
  constructor(
    private readonly productService: ProductService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly snackBarService: SnackBarService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }
  readonly dialog = inject(MatDialog);
  private readonly searchText$ = new Subject<DataTableFilter | string>();
  categories: ProductCategory[] = [];
  products: Product[] = [];
  product = new Product();
  dataCount = 0;
  addUpdateButtonText = 'Adicionar';
  title = 'Cadastrar Produto';
  @ViewChild("productDescription") productDescriptionField: ElementRef = new ElementRef(null);

  ngOnInit() {
    this.productCategoryService.get()
      .subscribe(categories => this.categories = categories[0]);

    this.searchText$.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.productService.get({ description: filters, offset: 0, take: 15 })

        return this.productService.get({ description: filters.filter, offset: filters.offset, take: filters.take })
      }),
    ).subscribe(products => {
      this.products = products[0];
      this.dataCount = products[1]
    });

    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id)
      return;

    this.productService.getById(id)
      .subscribe(product => {
        this.product = ({ ...product });
        this.title = product.description;
        this.addUpdateButtonText = 'Atualizar';
      });
  }

  setProduct(value: Product) {
    this.product = value;
  }

  setCategory(value: ProductCategory | null) {
    if (value)
      this.product.category = value;
  }

  setPrice(value: number) {
    this.product.productPrice = value;
  }

  getError() {
    const product = { ...this.product };
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
      ...this.product,
      description: this.product.description.trim(),
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
      this.snackBarService.success(`Produto ${this.product.description} atualizado com sucesso!`);
      this.router.navigate(['products']);
      return;
    }

    this.snackBarService.success(`Produto ${this.product.description} criado com sucesso!`);
    this.router.navigate(['products']);
  }

  edit(product: Product): void {
    this.product = { ...product };
  }

  getCurrencyValue = (value: number) =>
    getBrCurrencyStr(value);

  openDialog(product: Product): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar produto",
        content: `Deseja deletar o produto ${product.description}?`,
        onConfirmAction: () => this.deleteProductById(product.id!)
      }
    });
  }

  deleteProductById(id: string) {
    this.productService.safeDelete(id)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Produto deletado com sucesso');
          this.searchText$.next('');
        }),
        catchError(() => of(this.snackBarService.error('Falha ao deletar produto')))
      )
      .subscribe();
  }

  filterData(filters: DataTableFilter) {
    this.searchText$.next(filters);
  }
}
