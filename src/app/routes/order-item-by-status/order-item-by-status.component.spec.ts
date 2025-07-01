import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemByStatusComponent } from './order-item-by-status.component';

describe('OrderItemByStatusComponent', () => {
  let component: OrderItemByStatusComponent;
  let fixture: ComponentFixture<OrderItemByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemByStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
