import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ColumnProp, } from 'src/app/interfaces/data-table';
import { getCellValue } from 'src/app/utils/data-table-format';

@Component({
  selector: 'app-data-table',
  imports: [MatIconModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})

export class DataTableComponent<T> {
  readonly columns = input.required<ColumnProp<T>[]>();
  readonly data = input.required<T[]>();
  readonly removeAction = output<T>();
  readonly editAction = output<T>();

  remove(value: T) {
    this.removeAction.emit(value);
  }

  edit(value: T) {
    this.editAction.emit(value);
  }

  getColumnWidth(columnProp: ColumnProp<T>) {
    return columnProp.width ?? ''
  }

  displayCell(value: T, columnProp: ColumnProp<T>) {
    return getCellValue(value, columnProp)
  }
}
