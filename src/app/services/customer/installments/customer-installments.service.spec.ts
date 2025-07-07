import { TestBed } from '@angular/core/testing';

import { CustomerInstallmentsService } from './customer-installments.service';

describe('CustomerInstallmentsService', () => {
  let service: CustomerInstallmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerInstallmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
