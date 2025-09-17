import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, computed, inject, input, model, OnChanges, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-chips-autocomplete',
  templateUrl: './custom-chips-autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatChipsModule, FormsModule, MatAutocompleteModule, MatIconModule]
})

export class CustomChipsAutocompleteComponent<T> implements OnChanges {
  readonly displayValue = input.required<keyof T>();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentOption = model('');
  readonly selectedOptions = signal<string[]>([]);
  readonly data = input.required<T[]>();
  readonly defaultValue = input<T[] | null>(null);
  readonly handleOnChange = output<T[]>();
  readonly announcer = inject(LiveAnnouncer);
  readonly label = input.required<string>();
  readonly filteredData = computed(() => {
    const currentOption = this.currentOption().toLowerCase();
    const options = currentOption
      ? this.data().filter(option => (option[this.displayValue()] as string).toLowerCase().includes(currentOption))
      : this.data().slice();

    if (currentOption.length > 0)
      return [`Criar ${currentOption}`, ...options.map(x => x[this.displayValue()])]

    return [...options.map(x => x[this.displayValue()])];
  });

  ngOnChanges(): void {
    const defaultValue = this.defaultValue();
    if (!defaultValue)
      return;

    const options = defaultValue.map(x => x[this.displayValue()] as string);
    this.selectedOptions.set(options);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    this.addOption(value);
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

    this.addOption(optionToAdd);
    event.option.deselect();
  }

  addOption(option: string) {
    if (!option)
      return;

    if (this.selectedOptions().includes(option))
      return;

    this.selectedOptions.update(selectedOptions => [option, ...selectedOptions]);
    this.currentOption.set('');
    const displayValue = this.displayValue();

    const finalOptions = this.selectedOptions().map(selectedOption => {
      const existingOption = this.data().find(x => x[displayValue] === selectedOption);
      return existingOption ?? { [displayValue]: selectedOption } as T;
    })

    this.handleOnChange.emit(finalOptions);
  }
}
