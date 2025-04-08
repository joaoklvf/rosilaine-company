import { Component, input, OnInit, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-custom-autocomplete',
  templateUrl: './custom-autocomplete.component.html',
  styleUrls: ['./custom-autocomplete.component.scss'],
  standalone: false
})

export class CustomAutocompleteComponent<T> implements OnInit {
  readonly label = input('');
  readonly displayValue = input.required<keyof T>();
  readonly data = input<T[]>([]);
  readonly isCreatable = input(false);
  readonly handleOnChange = output<T>();

  myControl = new FormControl<T | null>(null);
  filteredData: Observable<T[]> = new Observable<T[]>();

  ngOnInit() {
    this.filteredData = this.myControl.valueChanges.pipe(
      map(value => {
        const dataFiltered = this.getFilteredData(value);

        if (this.isCreatable() && typeof value === 'string' && value.length > 0) {
          return [{ [this.displayValue()]: `Criar ${value}` } as T, ...dataFiltered];
        }

        return dataFiltered;
      })
    );
  }

  displayFn = (customer: T) =>
    customer?.[this.displayValue()] as string;

  private getFilteredData(value: T | string | null) {
    const filter = typeof value === 'string' ?
      value : value?.[this.displayValue()];

    return filter ?
      this._filter(filter as string) : this.data().slice(0, 10);
  }

  private _filter(value: string) {
    const filterValue = value?.toLowerCase();

    return this.data().filter(option => {
      const fieldValue = option[this.displayValue()];
      return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(filterValue);
    });
  }

  update(event: MatOptionSelectionChange<T>) {
    let currentValue = event.source.value;
    const currentKey = this.displayValue();

    if (typeof currentValue[currentKey] === 'string') {
      currentValue[currentKey] = currentValue[currentKey].replace("Criar ", "") as T[keyof T];
    }

    this.handleOnChange.emit(currentValue);
  }
}