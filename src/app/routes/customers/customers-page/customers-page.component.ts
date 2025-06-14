import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, Observable, skip, startWith, Subject, switchMap } from 'rxjs';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp, FormatValueOptions } from 'src/app/interfaces/data-table';
import { Customer } from 'src/app/models/customer/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-customers-page',
  imports: [RouterModule, DataTableComponent],
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.scss'
})
export class CustomersPageComponent implements OnInit {
  customers: Customer[] = [];
  private searchText$ = new Subject<DataTableFilter>();
  readonly columns: DataTableColumnProp<Customer>[] = [
    { description: "Nome", fieldName: "name", width: '50%' },
    { description: "Telefone", fieldName: "phone" },
    { description: "Data de nascimento", fieldName: "birthDate", formatValue: FormatValueOptions.Date },
  ]
  dataCount = 0;
  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit() {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.customerService.get({ name: filters })

        return this.customerService.get({ name: filters.filter, skip: filters.skip, take: filters.take })
      }),
    ).subscribe(customers => {
      const finalCustomers = customers as any;
      this.customers = finalCustomers[0];
      this.dataCount = finalCustomers[1]
    });
  }

  remove() {
    console.log('teste')
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

