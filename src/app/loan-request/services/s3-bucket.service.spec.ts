import { TestBed } from '@angular/core/testing';

import { S3BucketService } from './s3-bucket.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('S3BucketService', () => {
  let service: S3BucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(S3BucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
