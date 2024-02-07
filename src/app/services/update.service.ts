import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private swUpdate: SwUpdate) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((versionEvent) => {
        console.log(versionEvent.type);
        if (versionEvent.type === 'VERSION_READY') {
          window.alert('Actualizacion disponible, la pagina se recargara.');
          window.location.reload();
        }
      });
    }
  }
}
