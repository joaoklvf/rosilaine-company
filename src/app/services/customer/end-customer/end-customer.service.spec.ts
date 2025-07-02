import { TestBed } from '@angular/core/testing';

import { EndCustomerService } from './end-customer.service';

describe('EndCustomerService', () => {
  let service: EndCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
