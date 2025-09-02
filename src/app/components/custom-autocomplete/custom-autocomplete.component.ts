import { Component, input, OnInit, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-custom-autocomplete',
  templateUrl: './custom-autocomplete.component.html',
  styleUrls: ['./custom-autocomplete.component.scss'],
  imports: [MatAutocompleteModule, ReactiveFormsModule, MatInputModule]
})

export class CustomAutocompleteComponent<T extends object> implements OnInit {
  readonly label = input('');
  readonly displayValue = input.required<keyof T>();
  readonly data = input.required<T[]>();
  readonly handleOnChange = output<T | null>();
  readonly value = input<T | null>(null);
  readonly searchField = input<keyof T>();
  readonly searchAction = output<T | null | string>();
  readonly searchText$ = new Subject<T | string>();

  ngOnInit() {
    this.searchText$.pipe(
      debounceTime(1000),
      map(value => this.searchAction.emit(value))
    ).subscribe();
  }

  displayFn = (customer: T) =>
    customer?.[this.displayValue()] as string;

  update(event: MatAutocompleteSelectedEvent) {
    const currentValue = event.option.value;
    if (currentValue)
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

  onKeyUp(target: any) {
    this.searchText$.next(target?.value);
  }
}
