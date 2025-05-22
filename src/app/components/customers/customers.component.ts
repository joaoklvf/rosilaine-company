import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Customer } from 'src/app/models/customer/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { getBrDateStr } from 'src/app/utils/text-format';
import { DataTableComponent } from "../data-table/data-table.component";
import { ColumnProp, FormatValueOptions } from 'src/app/interfaces/data-table';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  imports: [MatIconModule, RouterModule, DataTableComponent]
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
    this.getHeroes();
  }

  getHeroes(): void {
    this.customerService.get()
      .subscribe(customers => this.customers = customers);
  }

  getFormatDate(date: Date) {
    return getBrDateStr(date);
  }

  remove() {
    console.log('teste')
  }

  edit(value: Customer) {
    this.router.navigate([`/customer/${value.id}`])
  }
}
