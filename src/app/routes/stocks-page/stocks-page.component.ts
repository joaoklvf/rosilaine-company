import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { StocksComponent } from "./components/stocks/stocks.component";
import { StockProductsComponent } from "./components/stock-products/stock-products.component";
import { startWith, debounceTime, switchMap, Subject, catchError, of, tap } from 'rxjs';
import { Stock } from 'src/app/models/stock/stock';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { StockService } from 'src/app/services/stock/stock.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-stocks-page',
  imports: [MatTabsModule, StocksComponent, StockProductsComponent],
  templateUrl: './stocks-page.component.html',
  styleUrl: './stocks-page.component.scss'
})
export class StocksPageComponent implements OnInit {
  private readonly searchText$ = new Subject<DataTableFilter | string>();

  stocks: Stock[] = [];
  dataCount = 0;

  constructor(
    private readonly stockService: StockService,
    private readonly snackBarService: SnackBarService,
  ) { }

  ngOnInit() {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.stockService.get({ description: filters, offset: 0, take: 15 })

        return this.stockService.get({ description: filters.filter, offset: filters.offset, take: filters.take })
      }),
    ).subscribe(stocks => {
      this.stocks = stocks[0];
      this.dataCount = stocks[1]
    });
  }

  addUpdateAction(stock: Stock) {
    if (stock.id) {
      this.stockService.update(stock)
        .subscribe(stock => {
          const customerIndex = this.stocks.findIndex(c => c.id === stock.id);
          this.stocks[customerIndex] = stock;
        });
    } else {
      this.stockService.add(stock)
        .subscribe(stock => {
          this.stocks.push(stock);
        });
    }
  }

  deleteStockById(id: string) {
    this.stockService.safeDelete(id)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Estoque deletado com sucesso');
          this.searchText$.next('');
        }),
        catchError(() => of(this.snackBarService.error('Falha ao deletar estoque')))
      )
      .subscribe();
  }

  filterData(customerName: DataTableFilter) {
    this.searchText$.next(customerName);
  }
}
