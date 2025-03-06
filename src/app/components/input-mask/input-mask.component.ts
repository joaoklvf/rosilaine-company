import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-input-mask',
    templateUrl: './input-mask.component.html',
    styleUrls: ['./input-mask.component.scss'],
    standalone: false
})
export class InputMaskComponent {
  @Input() label = '';
  @Input() value = 0;
  @Output() handleOnChange = new EventEmitter<number>();

  getCurrencyValue = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  update() {
    this.handleOnChange.emit(this.value);
  }

  get displayValue() { return this.getCurrencyValue(this.value) }
  set displayValue(v) { this.value = (parseFloat(v.replace(/\D/g, '')) || 0) / 100 }
}
