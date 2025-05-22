import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Customer } from 'src/app/models/customer/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ColumnProp, FormatValueOptions } from 'src/app/interfaces/data-table';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  imports: [RouterModule, DataTableComponent]
})

export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  columns: ColumnProp<Customer>[] = [
    { description: "Nome", fieldName: "name", width: '50%' },
    { description: "Telefone", fieldName: "phone" },
    { description: "Data de nascimento", fieldName: "birthDate", formatValue: FormatValueOptions.Date },
  ]

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customerService.get()
      .subscribe(customers => this.customers = customers);
  }  

  remove() {
    console.log('teste')
  }

  edit(value: Customer) {
    this.router.navigate([`/customer/${value.id}`])
  }
}
