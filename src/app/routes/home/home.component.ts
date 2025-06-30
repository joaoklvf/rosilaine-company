import { Component, OnInit } from '@angular/core';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { NextInstallmentsResponse } from 'src/app/interfaces/home-response';
import { CustomChartComponent } from "../../components/custom-chart/custom-chart.component";
import { HomeApiService } from 'src/app/services/home/home.service';
import { getAmountStr, getBrCurrencyStr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-home',
  imports: [DataTableComponent, CustomChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly columns: DataTableColumnProp<NextInstallmentsResponse>[] = [
    { description: "Cliente", fieldName: "customerName", width: '50%' },
    { description: "Data da parcela", fieldName: "installmentDate" },
    { description: "Valor (R$)", fieldName: "installmentAmount" },
  ]
  nextInstallments: NextInstallmentsResponse[] = [];
  dataCount = 0;
  installmentsBalance: number[] | undefined;
  installmentsTotal: string | undefined;
  pendingInstallments: string | undefined;

  readonly chartLabels = ['Recebido', 'Pendente'];

  constructor(private homeService: HomeApiService) { }

  ngOnInit() {
    this.getHomeData({ take: 15, offset: 0 });
  }

  getHomeData(params?: DataTableFilter) {
    this.homeService
      .getNextInstallments(params)
      .subscribe(homeResponse => {
        this.nextInstallments = homeResponse[0];
        this.dataCount = homeResponse[1]
      });

    this.homeService.getInstallmentsBalance()
      .subscribe(response => {
        this.installmentsBalance = [response.amountPaid, response.amountToReceive];
        this.installmentsTotal = getBrCurrencyStr(response.amountTotal);
        this.pendingInstallments = getAmountStr(response.pendingInstallments)
      })
  }
}
