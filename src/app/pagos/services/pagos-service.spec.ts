import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { PagosService } from './pagos-service';

describe('PagosService', () => {
  let service: PagosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(PagosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
