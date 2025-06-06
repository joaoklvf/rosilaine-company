import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getBrCurrencyStr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-input-mask',
  templateUrl: './input-mask.component.html',
  styleUrls: ['./input-mask.component.scss'],
  imports: [FormsModule]
})
export class InputMaskComponent {
  @Input() label = '';
  @Input() value = 0;
  @Output() handleOnChange = new EventEmitter<number>();
  @Output() handleDoubleClick = new EventEmitter();

  getCurrencyValue = (value: number) =>
    getBrCurrencyStr(value);

  update() {
    this.handleOnChange.emit(this.value);
  }

  doubleClickAction(){
    this.handleDoubleClick && this.handleDoubleClick.emit();
  }

  get displayValue() { return this.getCurrencyValue(this.value) }
  set displayValue(v) { this.value = (parseFloat(v.replace(/\D/g, '')) || 0) / 100 }
}
