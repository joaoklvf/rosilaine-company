import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { catchError, debounceTime, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { Product } from 'src/app/models/product/product';
import { ProductService } from 'src/app/services/product/product.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-products-page',
  imports: [RouterModule, DataTableComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent implements OnInit {
  private readonly searchText$ = new Subject<DataTableFilter | string>();
  readonly columns: DataTableColumnProp<Product>[] = [
    { description: "Produto", fieldName: "description", width: '50%' },
    { description: "Categoria", fieldName: "category.description" },
  ]
  products: Product[] = [];
  dataCount = 0;
  readonly dialog = inject(MatDialog);

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit() {
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
  }

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

  edit(value: Product) {
    this.router.navigate([`/product/${value.id}`])
  }

  addPageNavigate() {
    this.router.navigate(["/products/create"])
  }

  filterData(filters: DataTableFilter) {
    this.searchText$.next(filters);
  }
}
