import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { S3BucketService } from '../../services/s3-bucket.service';
import { Subject, takeUntil } from 'rxjs';
import { RemovePathPipe } from '../../pipes/remove-path.pipe';

@Component({
    selector: 'app-list-s3-files',
    imports: [CommonModule, CardModule, ButtonModule, RemovePathPipe],
    templateUrl: './list-s3-files.component.html'
})
export class ListS3FilesComponent implements OnInit, OnDestroy {
  readonly customerFolder = input.required<string>();
  readonly #s3BucketService = inject(S3BucketService);
  filesRecovered = signal<string[]>([]);
  destroy$ = new Subject();

  ngOnInit(): void {
    this.#s3BucketService
      .listRequestFiles(this.customerFolder())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (files) => {
          this.filesRecovered.set(files);
        },
      });
  }

  downloadFile(file: string) {
    const [path, filename] = file.split('/');
    this.#s3BucketService
      .downloadSingleFile(path, filename)
      .pipe(takeUntil(this.destroy$))
      .subscribe((signedUrl) => {
        const anchor = document.createElement('a');
        anchor.href = signedUrl;
        anchor.download = filename; // Nombre del archivo a guardar
        anchor.target = '_blank'; // Opcional: abre en una nueva pestaña (útil para algunos navegadores)
        anchor.click();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
