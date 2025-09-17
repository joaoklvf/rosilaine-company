import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { catchError, debounceTime, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { Customer } from 'src/app/models/customer/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { getCustomersNameNickName } from 'src/app/utils/text-format';

@Component({
  selector: 'app-customers-page',
  imports: [RouterModule, DataTableComponent],
  templateUrl: './customers-page.component.html',
})
export class CustomersPageComponent implements OnInit {
  private readonly searchText$ = new Subject<DataTableFilter | string>();
  readonly columns: DataTableColumnProp<Customer>[] = [
    { description: "Nome", fieldName: "name", width: '50%' },
    { description: "Telefone", fieldName: "phone" },
  ]
  customers: Customer[] = [];
  dataCount = 0;
  readonly dialog = inject(MatDialog);

  constructor(
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.customerService.get({ name: filters, offset: 0, take: 15 })

        return this.customerService.get({ name: filters.filter, offset: filters.offset, take: filters.take })
      }),
    ).subscribe(customers => {
      this.customers = getCustomersNameNickName(customers[0]);
      this.dataCount = customers[1]
    });
  }

  openDialog(customer: Customer): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar cliente",
        content: `Deseja deletar o cliente ${customer.name}?`,
        onConfirmAction: () => this.deleteCustomerById(customer.id!)
      }
    });
  }

  deleteCustomerById(id: string) {
    this.customerService.safeDelete(id)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Cliente deletado com sucesso');
          this.searchText$.next('');
        }),
        catchError(() => of(this.snackBarService.error('Falha ao deletar cliente')))
      )
      .subscribe();
  }

  edit(value: Customer) {
    this.router.navigate([`/customer/${value.id}`])
  }

  addPageNavigate() {
    this.router.navigate(["/customers/create"])
  }

  filterData(filters: DataTableFilter) {
    this.searchText$.next(filters);
  }
}

