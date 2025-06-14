import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DataTableColumnProp, } from 'src/app/interfaces/data-table';
import { getCellValue } from 'src/app/utils/data-table-format';
import { DataTablePaginationComponent } from './data-table-pagination/data-table-pagination.component';
import { DataTableFilter } from './data-table-interfaces';

@Component({
  selector: 'app-data-table',
  imports: [MatIconModule, ReactiveFormsModule, DataTablePaginationComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})

export class DataTableComponent<T> {
  readonly columns = input.required<DataTableColumnProp<T>[]>();
  readonly data = input.required<T[]>();
  readonly removeAction = output<T>();
  readonly editAction = output<T>();
  readonly showSearchField = input(false);
  readonly searchPlaceHolder = input('');
  readonly searchAction = output<DataTableFilter>();
  readonly dataPerPage = input(15);
  readonly dataCount = input(0);

  get hasMoreData() {
    return false;
  }

  get pagesCount() {
    return this.dataCount() / this.dataPerPage();
  }

  get readyData() {
    return this.data()
  }

  remove(value: T) {
    this.removeAction.emit(value);
  }

  edit(value: T) {
    this.editAction.emit(value);
  }

  getColumnWidth(columnProp: DataTableColumnProp<T>) {
    return columnProp.width ?? ''
  }

  displayCell(value: T, columnProp: DataTableColumnProp<T>) {
    return getCellValue(value, columnProp)
  }

  filterData(event: Event) {
    this.searchAction.emit({ filter: (event.target as HTMLInputElement).value, skip: 0, take: this.dataPerPage() });
  }

  changePageAction(skip: number) {
    this.searchAction.emit({ filter: '', skip: skip, take: this.dataPerPage() })
  }
}
