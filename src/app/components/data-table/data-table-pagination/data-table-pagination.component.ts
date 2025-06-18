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

  get _totalPages() {
    return this.totalPages();
  }

  get pagesCount() {
    return fillArrayFromNumber(this._totalPages)
  }

  get hasMoreData() {
    return this._totalPages > 1
  }

  onPrevButtonClick() {
    if (this.currentSkip === 0)
      return;

    this.currentSkip = this.currentSkip - 1;
    this.getData();
  }

  onNextButtonClick() {
    if (this.currentSkip === this._totalPages - 1)
      return;

    this.currentSkip++;
    this.getData();
  }

  onPageButtonClick(index: number) {
    this.currentSkip = index;
    this.getData();
  }

  getData() {
    this.searchAction.emit(this.currentSkip)
  }

  getClassName(index: number) {
    return `page-link ${index === this.currentSkip ? 'active' : ''}`;
  }
}
