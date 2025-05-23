import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ColumnProp, } from 'src/app/interfaces/data-table';
import { getCellValue } from 'src/app/utils/data-table-format';

@Component({
  selector: 'app-data-table',
  imports: [MatIconModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})

export class DataTableComponent<T> implements OnInit {
  readonly columns = input.required<ColumnProp<T>[]>();
  readonly data = input.required<T[]>();
  readonly removeAction = output<T>();
  readonly editAction = output<T>();
  searchParameterControl: FormControl<string> = new FormControl();

  ngOnInit(): void {
    this.searchParameterControl.setValue("Cliente");
  }

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
