import { TestBed } from '@angular/core/testing';

import { InstallmentsService } from './installments.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InstallmentsService', () => {
  let service: InstallmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(InstallmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
