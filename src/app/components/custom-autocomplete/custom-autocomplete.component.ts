import { AsyncPipe } from '@angular/common';
import { Component, input, OnChanges, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-custom-autocomplete',
  templateUrl: './custom-autocomplete.component.html',
  styleUrls: ['./custom-autocomplete.component.scss'],
  imports: [MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatInputModule]
})

export class CustomAutocompleteComponent<T extends object> implements OnChanges {
  readonly label = input('');
  readonly displayValue = input.required<keyof T>();
  readonly data = input.required<T[]>();
  readonly creatable = input(false);
  readonly handleOnChange = output<T | null>();
  readonly value = input<T | null>(null);

  myControl = new FormControl<T | null>(null);
  filteredData: Observable<T[]> = new Observable<T[]>();

  ngOnChanges() {
    this.myControl.setValue(this.value(), { emitEvent: false });

    this.filteredData = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const dataFiltered = this.getFilteredData(value);

        if (this.creatable() && typeof value === 'string' && value.length > 0) {
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

  update(event: MatAutocompleteSelectedEvent) {
    const currentValue = event.option.value;
    if (currentValue)
      this.emitOnChange(currentValue);
  }

  onBlur() {
    const currentValue = this.myControl.value;
    this.emitOnChange(currentValue);
  }

  emitOnChange(value: T | string | null) {
    const currentKey = this.displayValue();

    if (typeof value === "string") {
      this.handleOnChange.emit({ [currentKey]: value } as T);
      return;
    }

    if (value && typeof value[currentKey] === 'string') {
      value[currentKey] = value[currentKey].replace("Criar ", "") as T[keyof T];
    }

    this.handleOnChange.emit(value);
  }

  onFocus(event: FocusEvent) {
    (event.target as HTMLInputElement).select();
  }
}
