import { TestBed } from '@angular/core/testing';

import { BaseSubCollectionApiService } from './base-sub-collection-api.service';

describe('BaseSubCollectionApiService', () => {
  let service: BaseSubCollectionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseSubCollectionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
