import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { S3BucketService } from '../../services/s3-bucket.service';

@Component({
  selector: 'app-list-s3-files',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './list-s3-files.component.html',
})
export class ListS3FilesComponent implements OnInit {
  readonly customerFolder = input.required<string>();
  readonly #s3BucketService = inject(S3BucketService);
  filesRecovered = signal<string[]>([]);

  ngOnInit(): void {
    this.#s3BucketService.listRequestFiles(this.customerFolder()).subscribe({
      next: ({ files }) => {
        this.filesRecovered.set(files);
      },
    });
  }
}
