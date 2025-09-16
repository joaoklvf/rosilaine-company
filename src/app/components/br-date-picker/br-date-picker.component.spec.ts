import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrDatePickerComponent } from './br-date-picker.component';

describe('BrDatePickerComponent', () => {
  let component: BrDatePickerComponent;
  let fixture: ComponentFixture<BrDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BrDatePickerComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BrDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
