import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentsHeaderComponent } from './installments-header.component';

describe('InstallmentsHeaderComponent', () => {
  let component: InstallmentsHeaderComponent;
  let fixture: ComponentFixture<InstallmentsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
