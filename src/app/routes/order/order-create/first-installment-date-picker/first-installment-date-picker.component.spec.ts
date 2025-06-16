import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstInstallmentDatePickerComponent } from './first-installment-date-picker.component';

describe('FirstInstallmentDatePickerComponent', () => {
  let component: FirstInstallmentDatePickerComponent;
  let fixture: ComponentFixture<FirstInstallmentDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstInstallmentDatePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstInstallmentDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
