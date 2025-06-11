import { Component, input, output } from '@angular/core';
import { fillArrayFromNumber } from 'src/app/utils/arrays';

@Component({
  selector: 'app-data-table-pagination',
  imports: [],
  templateUrl: './data-table-pagination.component.html',
  styleUrl: './data-table-pagination.component.scss'
})
export class DataTablePaginationComponent {
  readonly searchAction = output<number>();
  readonly totalPages = input(1);
  readonly hasMoreData = input(false);
  currentPage = 1;

  get pagesCount(){
    return fillArrayFromNumber(this.totalPages())
  }

  onPrevButtonClick() {
    if (this.currentPage > 1)
      this.currentPage = this.currentPage - 1;

    this.getData();
  }

  onNextButtonClick() {
    this.currentPage++;
    this.getData();
  }

  getData() {
    this.searchAction.emit(this.currentPage)
  }
}
