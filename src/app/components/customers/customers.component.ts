import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { provideNgxMask } from 'ngx-mask';
import { Customer } from 'src/app/models/customer/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { getDateStrBr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [
    provideNgxMask(),
  ],
  standalone: false
})

export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  customer = new Customer();
  @ViewChild("customerName") customerNameField: ElementRef = new ElementRef(null);

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.customerService.get()
      .subscribe(customers => this.customers = customers);
  }

  add() {
    console.log(this.customer);
    const customer = {
      ...this.customer,
      name: this.customer.name.trim(),
    };
    if (!customer.name)
      return;

    if (customer.id > 0) {
      this.customerService.update(customer)
        .subscribe(customer => {
          console.log(customer, 'customer')
          const customerIndex = this.customers.findIndex(c => c.id === customer.id);
          this.customers[customerIndex] = customer;
          this.customer = new Customer();
        });
    } else {
      this.customerService.add(customer)
        .subscribe(customer => {
          this.customers.push(customer);
          this.customer = new Customer();
        });

      this.customerNameField.nativeElement.focus();
    }
  }

  setBirthDate(value: Date) {
    this.customer.birthDate = value;
  }

  getFormatDate(date: Date) {
    return getDateStrBr(date);
  }

  edit(customer: Customer): void {
    this.customer = { ...customer };
  }
}
