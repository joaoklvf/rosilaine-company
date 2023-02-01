import { Component, Input } from '@angular/core';
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
  @Input() editAction: (item: T) => void = () => { };
  @Input() deleteAction: (item: T) => void = () => { };

  formatValue(value: any, formatOption: FormatOptions = FormatOptions.Default) {
    return formatMap[formatOption](value);
  }
}
