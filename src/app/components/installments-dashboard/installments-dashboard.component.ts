import { Component, input, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DashInstallmentsResponse } from 'src/app/interfaces/home-response';
import { CustomChartComponent } from '../custom-chart/custom-chart.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { Router } from '@angular/router';
import { GetInstallmentsDataProps } from './interfaces/installments-dashboard';

@Component({
  selector: 'app-installments-dashboard',
  imports: [DataTableComponent, CustomChartComponent, MatTabsModule],
  templateUrl: './installments-dashboard.component.html',
  styleUrl: './installments-dashboard.component.scss'
})
export class InstallmentsDashboardComponent {
  constructor(private router: Router) { }

  readonly chartLabels = ['Recebido', 'Pendente'];
  readonly columns = input.required<DataTableColumnProp<DashInstallmentsResponse>[]>()

  readonly dashInstallments = input<DashInstallmentsResponse[]>();
  readonly dataCount = input(0);
  readonly installmentsBalance = input<number[] | undefined>();
  readonly installmentsTotal = input<string | undefined>();
  readonly pendingInstallments = input<string | undefined>();
  readonly getInstallmentsData = output<GetInstallmentsDataProps>();

  goToOrderPage(orderId: string) {
    this.router.navigate([`order/${orderId}`]);
  }

  searchAction(props: GetInstallmentsDataProps) {
    this.getInstallmentsData.emit(props);
  }

  onTabChangeAction(index: number) {
    this.getInstallmentsData.emit({ option: index });
  }
}
