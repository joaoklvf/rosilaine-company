import { Component, input } from '@angular/core';
import { CustomerInstallmentsMonthlyResponse } from 'src/app/interfaces/home-response';

@Component({
  selector: 'app-customer-month-table',
  imports: [],
  templateUrl: './customer-month-table.html',
  styleUrl: './customer-month-table.scss'
})
export class CustomerMonthTable {
  readonly monthInstallments = input<CustomerInstallmentsMonthlyResponse[]>();
}
