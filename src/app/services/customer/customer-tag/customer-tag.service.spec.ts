import { TestBed } from '@angular/core/testing';
import { CustomerTagService } from './customer-tag.service';


describe('CustomerTagsService', () => {
  let service: CustomerTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
