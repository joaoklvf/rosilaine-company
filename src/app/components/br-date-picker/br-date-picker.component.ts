import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Moment } from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-br-date-picker',
  templateUrl: './br-date-picker.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  imports: [MatDatepickerModule, MatFormFieldModule, FormsModule, MatInputModule]
})
export class BrDatePickerComponent {
  @Input() label = '';
  @Input() value: Date | null = new Date();
  @Output() handleOnChange = new EventEmitter<Date>();
  @Output() handleDoubleClick = new EventEmitter();

  update(event: MatDatepickerInputEvent<Moment>) {
    this.handleOnChange.emit(event.value?.toDate());
  }

  doubleClickAction() {
    this.handleDoubleClick?.emit();
  }
}
