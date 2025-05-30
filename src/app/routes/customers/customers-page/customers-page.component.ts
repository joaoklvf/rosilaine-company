import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, startWith, Subject, switchMap } from 'rxjs';
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
  private searchText$ = new Subject<string>();
  readonly columns: DataTableColumnProp<Customer>[] = [
    { description: "Nome", fieldName: "name", width: '50%' },
    { description: "Telefone", fieldName: "phone" },
    { description: "Data de nascimento", fieldName: "birthDate", formatValue: FormatValueOptions.Date },
  ]

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit() {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((customerName) => {
        return this.customerService.get({ name: customerName }, /* this.withRefresh */)
      }),
    ).subscribe(customers => this.customers = customers);
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

  filterData(customerName: string) {
    this.searchText$.next(customerName);
  }
}

