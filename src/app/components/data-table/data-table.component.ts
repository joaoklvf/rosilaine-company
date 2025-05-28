import { AsyncPipe, NgFor } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { DataTableColumnProp, } from 'src/app/interfaces/data-table';
import { getCellValue } from 'src/app/utils/data-table-format';

@Component({
  selector: 'app-data-table',
  imports: [MatIconModule, ReactiveFormsModule, AsyncPipe, NgFor],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})

export class DataTableComponent<T> {
  readonly columns = input.required<DataTableColumnProp<T>[]>();
  readonly data = input.required<T[]>();
  readonly data2 = input<Observable<T[]>>();
  readonly removeAction = output<T>();
  readonly editAction = output<T>();
  readonly showSearchField = input(false);
  readonly searchPlaceHolder = input('');
  readonly searchAction = output<string>();

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
    this.searchAction.emit((event.target as HTMLInputElement).value);
  }
}
