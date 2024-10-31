import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, switchMap } from 'rxjs';

import { environment } from 'src/environments/environment';

interface SignedUrls {
  uploadUrls: UploadURL[];
}

interface UploadURL {
  filename: string;
  signedUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class S3BucketService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.API_URL;
  constructor() {}

  getSignedUrls(filesToUpload: { filenames: string[] }) {
    const token = localStorage.getItem('token');
    return this.http.post<SignedUrls>(`${this.baseUrl}upload`, filesToUpload, {
      headers: { authorization: `${token}` },
    });
  }

  uploadFileWithSignedUrl(signedUrl: string, file: File) {
    const headers = new HttpHeaders({
      'Content-type': file.type,
    });

    console.log({ signedUrl, file });
    return this.http.put(signedUrl, file, { headers });
  }

  uploadFiles(files: File[], customerFolderName: string) {
    // TODO: cambiar el formato del back para que acepte un body distinto: string[]
    const temp = files.map((file) => `${customerFolderName}/${file.name}`);
    const filesToUpload = { filenames: temp };

    return this.getSignedUrls(filesToUpload).pipe(
      switchMap(({ uploadUrls }) => {
        const uploadTasks = files.map((file, index) => {
          return this.uploadFileWithSignedUrl(
            uploadUrls[index].signedUrl,
            file
          );
        });
        return forkJoin(uploadTasks);
      })
    );
  }
}
