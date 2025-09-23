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
      return 'relative inline-flex items-center px-4 py-2 text-sm cursor-pointer text-gray-400 inset-ring inset-ring-gray-300 dark:inset-ring-gray-700 focus:outline-offset-0';

    if (Number(page) === this.currentPage)
      return 'relative z-10 inline-flex items-center bg-indigo-500 px-4 py-2 text-sm cursor-pointer text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'

    return "relative inline-flex items-center px-4 py-2 text-sm cursor-pointer dark:text-gray-200 text-gray-900 inset-ring inset-ring-gray-300 dark:inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0";
  }
}
