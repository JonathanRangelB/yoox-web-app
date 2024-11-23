import { TestBed } from '@angular/core/testing';

import { SearchCustomersService } from './search-customers.service';

describe('SearchCustomersService', () => {
  let service: SearchCustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchCustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
