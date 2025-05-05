import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getCurrencyStrBr } from 'src/app/utils/text-format';

@Component({
    selector: 'app-input-mask',
    templateUrl: './input-mask.component.html',
    styleUrls: ['./input-mask.component.scss'],
    imports: [FormsModule, NgIf]
})
export class InputMaskComponent {
  @Input() label = '';
  @Input() value = 0;
  @Output() handleOnChange = new EventEmitter<number>();

  getCurrencyValue = (value: number) =>
    getCurrencyStrBr(value);

  update() {
    this.handleOnChange.emit(this.value);
  }

  get displayValue() { return this.getCurrencyValue(this.value) }
  set displayValue(v) { this.value = (parseFloat(v.replace(/\D/g, '')) || 0) / 100 }
}
