import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-custom-chips-autocomplete',
  templateUrl: './custom-chips-autocomplete.component.html',
  styleUrl: './custom-chips-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CustomChipsAutocompleteComponent<T> {
  readonly displayValue = input.required<keyof T>();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentOption = model('');
  readonly selectedOptions = signal<string[]>([]);
  readonly data = input<T[]>([]);
  readonly handleOnChange = output<T[]>();
  readonly announcer = inject(LiveAnnouncer);  
  readonly label  = input.required<string>();
  readonly filteredData = computed(() => {
    const currentOption = this.currentOption().toLowerCase();
    const options = currentOption
      ? this.data().filter(option => (option[this.displayValue()] as string).toLowerCase().includes(currentOption))
      : this.data().slice();

    if (currentOption.length > 0)
      return [`Criar ${currentOption}`, ...options.map(x => x[this.displayValue()])]

    return [...options.map(x => x[this.displayValue()])];
  });

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedOptions.update(selectedOptions => [...selectedOptions, value]);
    }

    this.currentOption.set('');
    this.handleOnChange.emit(this.selectedOptions().map(x => ({ description: x, id: x.length } as T)))
  }

  remove(option: string): void {
    this.selectedOptions.update(selectedOptions => {
      const index = selectedOptions.indexOf(option);
      if (index < 0) {
        return selectedOptions;
      }

      selectedOptions.splice(index, 1);
      this.announcer.announce(`Removed ${option}`);
      return [...selectedOptions];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const optionToAdd = event.option.viewValue.replace('Criar ', '');
    if (this.selectedOptions().includes(optionToAdd))
      return;
    
    this.selectedOptions.update(selectedOptions => [...selectedOptions, optionToAdd]);
    this.currentOption.set('');
    event.option.deselect();
    this.handleOnChange.emit(this.selectedOptions().map(x => ({ description: x, id: x.length } as T)))
  }
}
