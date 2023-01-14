import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  customer = new Customer();
  @ViewChild("customerName") myInputField: ElementRef = new ElementRef(null);

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.customerService.getCustomers()
      .subscribe(customers => this.customers = customers);
  }

  add() {
    const customer = {
      ...this.customer,
      name: this.customer.name.trim(),
    };
    if (!customer.name)
      return;

    this.customerService.addCustomer(customer)
      .subscribe(customer => {
        this.customers.push(customer);
        this.customer = new Customer();
      });

    this.myInputField.nativeElement.focus();
  }

  getFormatDate(date: Date) {
    return moment(date).format('DD/MM/YYYY');
  }

  setBirthDate(value: Date) {
    this.customer.birthDate = value;
  }
}
