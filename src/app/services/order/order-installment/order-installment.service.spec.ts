import { TestBed } from '@angular/core/testing';

import { OrderInstallmentService } from './order-installment.service';

describe('OrderInstallmentService', () => {
  let service: OrderInstallmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderInstallmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
