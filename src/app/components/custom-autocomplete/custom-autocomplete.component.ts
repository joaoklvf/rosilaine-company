import { Component, OnInit, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-custom-autocomplete',
  templateUrl: './custom-autocomplete.component.html',
  styleUrls: ['./custom-autocomplete.component.scss'],
  standalone: false
})

export class CustomAutocompleteComponent<T> implements OnInit {
  readonly label = input('');
  readonly displayValue = input<keyof T>('name' as keyof T);
  readonly data = input<T[]>([]);
  readonly isCreatable = input(false);
  readonly handleOnChange = output<T>();

  myControl = new FormControl<T | null>(null);
  filteredData: Observable<T[]> = new Observable<T[]>();

  constructor() { }

  ngOnInit() {
    if (this.isCreatable()) {
      this.filteredData = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const filtered = this.filter(value as string);
          return (value as string).length === 0 ? filtered : [{ name: `Criar ${value}` } as T, ...filtered]; // Adiciona o novo item ao final
        })
      );

      return;
    }

    this.filteredData = this.myControl.valueChanges.pipe(
      map(value => {
        const name = typeof value === 'string' ? value : value?.[this.displayValue()];
        return name ? this.filter(name as string) : this.data().slice();
      }),
    );
  }

  displayFn = (customer: T) =>
    customer[this.displayValue()] as string;

  private filter(value: string) {
    const filterValue = value?.toLowerCase();
    return this.data().filter(option => (option[this.displayValue()] as string).toLowerCase().includes(filterValue));
  }

  update(event: MatOptionSelectionChange<T>) {
    this.handleOnChange.emit(event.source.value);
  }
}