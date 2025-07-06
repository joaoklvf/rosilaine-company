import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentsDashboardComponent } from './installments-dashboard.component';

describe('InstallmentsDashboardComponent', () => {
  let component: InstallmentsDashboardComponent;
  let fixture: ComponentFixture<InstallmentsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
