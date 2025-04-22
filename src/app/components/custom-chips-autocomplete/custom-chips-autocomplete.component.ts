import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, computed, inject, model, output, signal } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { CustomerTag } from 'src/app/models/customer/customer-tag';
import { CustomerTagService } from 'src/app/services/customer-tag/customer-tag.service';

@Component({
  selector: 'app-custom-chips-autocomplete',
  templateUrl: './custom-chips-autocomplete.component.html',
  styleUrl: './custom-chips-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CustomChipsAutocompleteComponent {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentFruit = model('');
  readonly fruits = signal<string[]>([]);
  allFruits: CustomerTag[] = [];
  readonly filteredFruits = computed(() => {
    const currentFruit = this.currentFruit().toLowerCase();
    const options = currentFruit
      ? this.allFruits.filter(fruit => fruit.description.toLowerCase().includes(currentFruit))
      : this.allFruits.slice();

    return [`Criar ${currentFruit}`, ...options.map(x => x.description)]
  });
  readonly handleOnChange = output<CustomerTag[]>();

  readonly announcer = inject(LiveAnnouncer);

  constructor(private customerTagService: CustomerTagService) {
    customerTagService.get().subscribe(tags => this.allFruits = tags);
  }


  add(event: MatChipInputEvent): void {
    console.log('add');
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.fruits.update(fruits => [...fruits, value]);
    }

    // Clear the input value
    this.currentFruit.set('');
  }

  remove(fruit: string): void {
    this.fruits.update(fruits => {
      const index = fruits.indexOf(fruit);
      if (index < 0) {
        return fruits;
      }

      fruits.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
      return [...fruits];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('aqui')
    this.fruits.update(fruits => [...fruits, event.option.viewValue.replace('Criar ', '')]);
    this.currentFruit.set('');
    event.option.deselect();
    this.handleOnChange.emit(this.fruits().map(x => ({ description: x, id: x.length } as CustomerTag)))
  }
}
