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
  currentOffset = 0;

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
    if (this.currentOffset === 0)
      return;

    this.currentOffset = this.currentOffset - 1;
    this.getData();
  }

  onNextButtonClick() {
    if (this.currentOffset === this._totalPages - 1)
      return;

    this.currentOffset++;
    this.getData();
  }

  onPageButtonClick(index: number) {
    this.currentOffset = index;
    this.getData();
  }

  getData() {
    this.searchAction.emit(this.currentOffset)
  }

  getClassName(index: number) {
    return `page-link ${index === this.currentOffset ? 'active' : ''}`;
  }
}
