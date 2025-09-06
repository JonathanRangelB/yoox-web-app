import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removePath',
  standalone: true,
})
export class RemovePathPipe implements PipeTransform {
  transform(value: string): string {
    return value.split('/')[1];
  }
}
