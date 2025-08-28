import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GetInstallmentsDataProps } from 'src/app/components/installments-dashboard/interfaces/installments-dashboard';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { DashInstallmentsResponse } from 'src/app/interfaces/home-response';
import { HomeApiService } from 'src/app/services/home/home.service';
import { getAmountStr, getBrCurrencyStr } from 'src/app/utils/text-format';
import { InstallmentsDashboardComponent } from "../../components/installments-dashboard/installments-dashboard.component";
import { HomeDashOptions } from './interfaces/home';

@Component({
  selector: 'app-home',
  imports: [InstallmentsDashboardComponent, MatTabsModule, InstallmentsDashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly TAKE_OFFSET_OPTIONS = { take: 15, offset: 0 };

  readonly columns: DataTableColumnProp<DashInstallmentsResponse>[] = [
    { description: "Cliente", fieldName: "customerName", width: '50%' },
    { description: "Data da parcela", fieldName: "installmentDate" },
    { description: "Valor (R$)", fieldName: "installmentsAmount" },
  ]
  dashInstallments: DashInstallmentsResponse[] = [];
  dataCount = 0;
  installmentsBalance: number[] | undefined;
  installmentsTotal: string | undefined;
  pendingInstallments: string | undefined;

  constructor(
    private readonly homeService: HomeApiService
  ) { }

  ngOnInit() {
    this.getInstallmentsData({ option: HomeDashOptions.OverdueInstallments, filter: this.TAKE_OFFSET_OPTIONS });

    this.homeService.getInstallmentsBalance()
      .subscribe(response => {
        this.installmentsBalance = [response.amountPaid, response.amountToReceive];
        this.installmentsTotal = getBrCurrencyStr(response.amountTotal);
        this.pendingInstallments = getAmountStr(response.pendingInstallments)
      })
  }

  getInstallmentsData({ option, filter }: GetInstallmentsDataProps) {
    const params = filter ?? this.TAKE_OFFSET_OPTIONS;
    const observable = option === HomeDashOptions.NextInstallments ?
      this.homeService.getNextInstallments(params) : this.homeService.getOverdueInstallments(params);

    observable
      .subscribe(homeResponse => {
        this.dashInstallments = homeResponse[0];
        this.dataCount = homeResponse[1]
      });
  }
}
