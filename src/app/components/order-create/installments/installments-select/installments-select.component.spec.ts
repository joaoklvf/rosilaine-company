import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentsSelectComponent } from './installments-select.component';

describe('InstallmentsSelectComponent', () => {
  let component: InstallmentsSelectComponent;
  let fixture: ComponentFixture<InstallmentsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentsSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
