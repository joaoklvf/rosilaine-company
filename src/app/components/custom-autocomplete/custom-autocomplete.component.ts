import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-custom-autocomplete',
  templateUrl: './custom-autocomplete.component.html',
  styleUrls: ['./custom-autocomplete.component.scss']
})
export class CustomAutocompleteComponent<T> implements OnInit {
  @Input() label = '';
  @Output() handleOnChange = new EventEmitter<T>();
  @Input() data: T[] = [];
  @Input() getOptionLabel: (value: T | null) => string = (value: T | null) => value?.toString() || '';
  myControl = new FormControl<T | null>(null);
  filteredData: Observable<T[]> = new Observable<T[]>();

  ngOnInit() {
    this.filteredData = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        let name = null;
        if (value && typeof value === 'string')
          name = value;
        else if (value && typeof value !== 'string')
          name = this.getOptionLabel(value);

        return name ? this._filter(name as string) : this.data.slice();
      }),
    );
  }

  private _filter(value: string): T[] {
    const filterValue = this._normalizeValue(value);
    return this.data.filter(valueToFilter => this._normalizeValue(this.getOptionLabel(valueToFilter)).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  update(event: MatOptionSelectionChange<T>) {
    this.handleOnChange.emit(event.source.value);
  }
}
