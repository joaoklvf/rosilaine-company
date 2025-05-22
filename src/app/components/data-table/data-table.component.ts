import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ColumnProp, FormatValueOptions } from 'src/app/interfaces/data-table';
import { getCellFormattedValue } from 'src/app/utils/data-table-format';

@Component({
  selector: 'app-data-table',
  imports: [MatIconModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})

export class DataTableComponent<T> {
  columns = input.required<ColumnProp<T>[]>();
  data = input.required<T[]>();
  removeAction = output<void>();
  editAction = output<T>();

  remove() {
    this.removeAction.emit();
  }

  edit(value: T) {
    this.editAction.emit(value);
  }

  getColumnWidth(columnProp: ColumnProp<T>) {
    return columnProp.width ?? ''
  }

  getCellValue(value: T, columnProp: ColumnProp<T>) {
    return getCellFormattedValue(value[columnProp.fieldName] as string | number, columnProp.formatValue)
  }
}
