import { TestBed } from '@angular/core/testing';
import { OrderItemStatusService } from './order-item-status.service';

describe('OrderItemStatusService', () => {
  let service: OrderItemStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderItemStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
