import { Injectable, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

const DEFAULT_DESKTOP_APP_URL =
  'https://www.mediafire.com/file/ohqloylfql6hti7/InstaladorYOOX-Release-2026-15-03.msi';

@Injectable({ providedIn: 'root' })
export class DesktopAppService {
  private http = inject(HttpClient);
  private baseUrl = environment.API_URL;
  private desktopAppResponse = toSignal(
    this.http
      .get<{ url: string }>(`${this.baseUrl}desktop-app-url`)
      .pipe(catchError(() => of({ url: DEFAULT_DESKTOP_APP_URL }))),
    { initialValue: { url: DEFAULT_DESKTOP_APP_URL } }
  );

  desktopAppUrl = computed(() => this.desktopAppResponse().url);
}
