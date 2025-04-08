import { Component, input, OnInit, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-custom-autocomplete',
  templateUrl: './custom-autocomplete.component.html',
  styleUrls: ['./custom-autocomplete.component.scss'],
  standalone: false
})

export class CustomAutocompleteComponent<T> {
  readonly label = input('');
  readonly displayValue = input.required<keyof T>();
  readonly data = input<T[]>([]);
  readonly isCreatable = input(false);
  readonly handleOnChange = output<T>();

  myControl = new FormControl('');
  filteredData: Observable<T[]>;

  constructor() {
    this.filteredData = this.myControl.valueChanges.pipe(
      startWith(''),
      map(option => this._filterData(option || ''))
    );
  }

  update(event: MatOptionSelectionChange<T>) {
    let currentValue = event.source.value;
    const currentKey = this.displayValue();

    if (typeof currentValue[currentKey] === 'string') {
      currentValue[currentKey] = currentValue[currentKey].replace("Criar ", "") as T[keyof T];
    }

    this.handleOnChange.emit(currentValue);
  }

  private _filterData(value: string): T[] {
    const filterValue = value.toLowerCase();

    return this.data().filter(option => (option[this.displayValue()] as string).toLowerCase().includes(filterValue));
  }
}
