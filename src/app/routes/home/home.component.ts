import { Component, OnInit } from '@angular/core';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { NextInstallmentsResponse } from 'src/app/interfaces/home-response';
import { CustomChartComponent } from "../../components/custom-chart/custom-chart.component";
import { HomeApiService } from 'src/app/services/home/home.service';
import { getAmountStr, getBrCurrencyStr } from 'src/app/utils/text-format';
import { MatTabsModule } from '@angular/material/tabs';
import { HomeDashOptions } from './interfaces/home';

@Component({
  selector: 'app-home',
  imports: [DataTableComponent, CustomChartComponent, MatTabsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly NEXT_INSTALLMENTS = HomeDashOptions.NextInstallments;
  readonly OVERDUE_INSTALLMENTS = HomeDashOptions.OverdueInstallments;
  readonly columns: DataTableColumnProp<NextInstallmentsResponse>[] = [
    { description: "Cliente", fieldName: "customerName", width: '50%' },
    { description: "Data da parcela", fieldName: "installmentDate" },
    { description: "Valor (R$)", fieldName: "installmentAmount" },
  ]
  dashInstallments: NextInstallmentsResponse[] = [];
  dataCount = 0;
  installmentsBalance: number[] | undefined;
  installmentsTotal: string | undefined;
  pendingInstallments: string | undefined;

  readonly chartLabels = ['Recebido', 'Pendente'];

  constructor(private homeService: HomeApiService) { }

  ngOnInit() {
    const takeOffsetOptions = { take: 15, offset: 0 };
    this.getInstallmentsData(this.NEXT_INSTALLMENTS, takeOffsetOptions);

    this.homeService.getInstallmentsBalance()
      .subscribe(response => {
        this.installmentsBalance = [response.amountPaid, response.amountToReceive];
        this.installmentsTotal = getBrCurrencyStr(response.amountTotal);
        this.pendingInstallments = getAmountStr(response.pendingInstallments)
      })
  }

  getInstallmentsData(dashOption: HomeDashOptions, params?: DataTableFilter) {
    const observable = dashOption === this.NEXT_INSTALLMENTS ?
      this.homeService.getNextInstallments(params) : this.homeService.getOverdueInstallments(params);

    observable
      .subscribe(homeResponse => {
        this.dashInstallments = homeResponse[0];
        this.dataCount = homeResponse[1]
      });
  }
}
