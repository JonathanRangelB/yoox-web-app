import { TestBed } from '@angular/core/testing';

import { LoanRequestService } from './loan-request.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoanRequestService', () => {
  let service: LoanRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LoanRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
