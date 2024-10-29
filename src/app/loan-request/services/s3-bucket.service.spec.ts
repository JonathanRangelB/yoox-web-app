import { TestBed } from '@angular/core/testing';

import { S3BucketService } from './s3-bucket.service';

describe('S3BucketService', () => {
  let service: S3BucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S3BucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
