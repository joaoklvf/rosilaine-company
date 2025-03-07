import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() label = '';
  @Input() displayValue: keyof T = 'name' as keyof T;
  @Input() data: T[] = [];
  @Input() isCreatable = false;
  @Output() handleOnChange = new EventEmitter<T>();

  myControl = new FormControl<T | null>(null);
  filteredData: Observable<T[]> = new Observable<T[]>();

  constructor() { }

  ngOnInit() {
    if (this.isCreatable) {
      this.filteredData = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const filtered = this._filter(value as string);
          return (value as string).length === 0 ? filtered : [{ name: `Criar ${value}` } as T, ...filtered]; // Adiciona o novo item ao final
        })
      );

      return;
    }

    this.filteredData = this.myControl.valueChanges.pipe(
      map(value => {
        const name = typeof value === 'string' ? value : value?.[this.displayValue];
        return name ? this._filter(name as string) : this.data.slice();
      }),
    );
  }

  displayFn = (customer: T) =>
    customer[this.displayValue] as string || 'ERRO';


  private _filter(value: string): T[] {
    const filterValue = this._normalizeValue(value);
    return this.data.filter(customer => this._normalizeValue(customer[this.displayValue] as string).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  update(event: MatOptionSelectionChange<T>) {
    this.handleOnChange.emit(event.source.value);
  }
}