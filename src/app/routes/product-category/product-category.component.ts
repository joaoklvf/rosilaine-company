import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, startWith, debounceTime, switchMap, catchError, of, tap } from 'rxjs';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { ProductCategory } from 'src/app/models/product/product-category';
import { ProductCategoryService } from 'src/app/services/product/product-category/product-category.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-product-category',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductCategoryComponent {
  private searchText$ = new Subject<DataTableFilter | string>();
  readonly columns: DataTableColumnProp<ProductCategory>[] = [
    { description: "Categoria", fieldName: "description", width: '85%' },
  ]
  readonly dialog = inject(MatDialog);
  productCategory: ProductCategory = new ProductCategory();
  productCategories: ProductCategory[] = [];
  dataCount = 0;

  @ViewChild("productCategoryDescription") productCategoryDescriptionField: ElementRef = new ElementRef(null);

  constructor(private productCategoryService: ProductCategoryService, private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.productCategoryService.get({ description: filters, offset: 0, take: 15 })

        return this.productCategoryService.get({ description: filters.filter, offset: filters.offset, take: filters.take })
      }),
    ).subscribe(productCategories => {
      this.productCategories = productCategories[0];
      this.dataCount = productCategories[1]
    });
  }

  edit(productCategory: ProductCategory): void {
    this.productCategory = { ...productCategory };
  }

  add() {
    const productCategory: ProductCategory = {
      ...this.productCategory,
      description: this.productCategory.description.trim(),
    };

    if (!productCategory.description)
      return;

    if (productCategory.id) {
      this.productCategoryService.update(productCategory)
        .subscribe(productCategory => {
          const customerIndex = this.productCategories.findIndex(c => c.id === productCategory.id);
          this.productCategories[customerIndex] = productCategory;
          this.productCategory = new ProductCategory();
        });
    } else {
      this.productCategoryService.add(productCategory)
        .subscribe(productCategory => {
          this.productCategories.push(productCategory);
          this.productCategory = new ProductCategory();
        });

      this.productCategoryDescriptionField.nativeElement.focus();
    }
  }

  openDialog(productCategory: ProductCategory): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar categoria",
        content: `Deseja deletar a categoria ${productCategory.description}?`,
        onConfirmAction: () => this.deleteProductCategoryById(productCategory.id!)
      }
    });
  }

  deleteProductCategoryById(id: string) {
    this.productCategoryService.safeDelete(id)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Categoria deletada com sucesso');
          this.searchText$.next('');
        }),
        catchError(() => of(this.snackBarService.error('Falha ao deletar categoria')))
      )
      .subscribe();
  }

  filterData(filters: DataTableFilter) {
    this.searchText$.next(filters);
  }
}
