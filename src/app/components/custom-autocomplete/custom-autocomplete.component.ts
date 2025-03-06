import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
    selector: 'app-custom-autocomplete',
    templateUrl: './custom-autocomplete.component.html',
    styleUrls: ['./custom-autocomplete.component.scss'],
    standalone: false
})
export class CustomAutocompleteComponent implements OnInit {
  @Input() label = '';
  @Output() handleOnChange = new EventEmitter<Customer>();
  
  customers: Customer[] = [];
  myControl = new FormControl<Customer>(new Customer());
  filteredCustomers: Observable<Customer[]> = new Observable<Customer[]>();
  
  constructor(private customerService: CustomerService) { }
  
  ngOnInit() {
    this.customerService.getCustomers()
      .subscribe(customers => this.customers = customers);
    this.filteredCustomers = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.customers.slice();
      }),
    );
  }
  displayFn(customer: Customer): string {
    return customer.name || '';
  }
  private _filter(value: string): Customer[] {
    const filterValue = this._normalizeValue(value);
    return this.customers.filter(customer => this._normalizeValue(customer.name).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  update(event: MatOptionSelectionChange<Customer>){
    this.handleOnChange.emit(event.source.value);
  }
}
