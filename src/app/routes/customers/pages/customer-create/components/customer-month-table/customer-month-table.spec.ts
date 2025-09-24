import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMonthTable } from './customer-month-table';

describe('CustomerMonthTable', () => {
  let component: CustomerMonthTable;
  let fixture: ComponentFixture<CustomerMonthTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMonthTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMonthTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
