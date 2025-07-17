import { Component, input, output } from '@angular/core';
import { getPages } from './utils/data-table-pagination-util';

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

  get currentPage() {
    return this.currentOffset + 1;
  }

  get _totalPages() {
    return this.totalPages();
  }

  get pages() {
    return getPages(this._totalPages, this.currentPage)
  }

  get hasMoreData() {
    return this._totalPages > 1
  }

  onPrevButtonClick() {
    if (this.currentOffset === 0)
      return;

    this.currentOffset--;
    this.getData();
  }

  onNextButtonClick() {
    if (this.currentOffset === this._totalPages - 1)
      return;

    this.currentOffset++;
    this.getData();
  }

  onPageButtonClick(page: string) {
    this.currentOffset = Number(page) - 1;
    this.getData();
  }

  getData() {
    this.searchAction.emit(this.currentOffset)
  }

  getClassName(page: string) {
    if (page === '...')
      return 'disabled';

    if (Number(page) === this.currentPage)
      return 'active'

    return '';
  }
}
