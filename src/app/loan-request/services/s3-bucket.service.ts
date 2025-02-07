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

  getSignedUrls(filesToUpload: { filenames: string[] }) {
    const baseUrl = environment.API_URL;
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    return this.http.post<SignedUrls>(`${baseUrl}upload`, filesToUpload, {
      headers: { authorization: `${token}` },
    });
  }

  uploadFileWithSignedUrl(signedUrl: string, file: File) {
    const headers = new HttpHeaders({
      'Content-type': file.type,
    });

    return this.http.put(signedUrl, file, { headers });
  }

  uploadFiles(files: File[], customerFolderName: string) {
    const filenames = files.map((file) => `${customerFolderName}/${file.name}`);
    const filesToUpload = { filenames };

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

  listRequestFiles(requestNumber: string) {
    const baseUrl = environment.API_URL;
    const token = localStorage.getItem('token');
    return this.http.get<string[]>(
      `${baseUrl}list-files/${requestNumber}`,
      {
        headers: { authorization: `${token}` },
      }
    );
  }

  downloadSingleFile(path: string, filename: string) {
    const baseUrl = environment.API_URL;
    const token = localStorage.getItem('token');
    return this.http.post<string>(
      `${baseUrl}file`,
      { path: `${path}/`, filename },
      {
        headers: { authorization: `${token}` },
      }
    );
  }
}
