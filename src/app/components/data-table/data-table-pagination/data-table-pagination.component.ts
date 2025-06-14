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
  currentSkip = 0;

  get pagesCount() {
    return fillArrayFromNumber(this.totalPages())
  }

  get hasMoreData (){
    return this.totalPages() > 1
  }

  onPrevButtonClick() {
    if (this.currentSkip === 0)
      return;

    this.currentSkip = this.currentSkip - 1;
    this.getData();
  }

  onNextButtonClick() {
    if (this.currentSkip === this.totalPages() - 1)
      return;

    this.currentSkip++;
    this.getData();
  }

  getData() {
    this.searchAction.emit(this.currentSkip)
  }
}
