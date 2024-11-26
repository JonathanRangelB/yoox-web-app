import { TestBed } from '@angular/core/testing';

import { SearchCustomersService } from './search-customers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchCustomersService', () => {
  let service: SearchCustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SearchCustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
