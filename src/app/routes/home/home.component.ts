import { Component, OnInit } from '@angular/core';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { HomeResponse } from 'src/app/interfaces/home-response';
import { HomeApiService as HomeService } from 'src/app/services/home/home.service';
import { OrderInstallmentService } from 'src/app/services/order/order-installment/order-installment.service';

@Component({
  selector: 'app-home',
  imports: [DataTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly columns: DataTableColumnProp<HomeResponse>[] = [
    { description: "Cliente", fieldName: "customerName", width: '50%' },
    { description: "Data da parcela", fieldName: "installmentDate" },
    { description: "Valor (R$)", fieldName: "installmentAmount" },
  ]
  homeData: HomeResponse[] = [];
  dataCount = 0;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getHomeData({ take: 15, offset: 0 });
  }

  getHomeData(params?: DataTableFilter) {
    this.homeService
      .get(params)
      .subscribe(homeResponse => {
        this.homeData = homeResponse[0];
        this.dataCount = homeResponse[1]
      });
  }
}
