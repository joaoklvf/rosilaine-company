import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatMap, FormatOptions } from 'src/app/interfaces/format';
import { ColumnProps } from './interfaces';

@Component({
  selector: 'app-generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.scss']
})
export class GenericListComponent<T> {
  @Input() data: T[] = [];
  @Input() columnsProps: ColumnProps<T>[] = [];
  @Input() title: string = '';
  @Output() editAction = new EventEmitter<T>();
  @Output() deleteAction = new EventEmitter<T>();

  formatValue(value: any, formatOption: FormatOptions = FormatOptions.Default) {
    return formatMap[formatOption](value);
  }

  update(value: T) {
    this.editAction.emit(value);
  }

  remove(value: T) {
    this.deleteAction.emit(value);
  }
}
