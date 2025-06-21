import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp, FormatValueOptions } from 'src/app/interfaces/data-table';
import { Customer } from 'src/app/models/customer/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-customers-page',
  imports: [RouterModule, DataTableComponent],
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.scss'
})
export class CustomersPageComponent implements OnInit {
  private searchText$ = new Subject<DataTableFilter | string>();
  readonly columns: DataTableColumnProp<Customer>[] = [
    { description: "Nome", fieldName: "name", width: '50%' },
    { description: "Telefone", fieldName: "phone" },
    { description: "Data de nascimento", fieldName: "birthDate", formatValue: FormatValueOptions.Date },
  ]
  customers: Customer[] = [];
  dataCount = 0;

  constructor(private customerService: CustomerService, private router: Router, private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.customerService.get({ name: filters, offset: 0, take: 15 })

        return this.customerService.get({ name: filters.filter, offset: filters.offset, take: filters.take })
      }),
    ).subscribe(customers => {
      this.customers = customers[0];
      this.dataCount = customers[1]
    });
  }

  remove(id: string) {
    this.customerService.safeDelete(id)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Cliente excluído com sucesso');
          this.searchText$.next('');
        }),
        catchError(() => of(this.snackBarService.error('Falha excluir cliente')))
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

