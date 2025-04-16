import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Refinance } from './types/refinance';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-refinance-search',
  imports: [CommonModule, DropdownModule],
  templateUrl: './refinance-search.component.html',
})
export class RefinanceSearchComponent implements OnInit {
  readonly searchId = input.required<string | number>();
  readonly searchRefinanceResults = output<Refinance>();
  readonly #searchRefinanceService = inject(HttpClient);
  readonly #destroyRef$ = inject(DestroyRef);
  endpoint = environment.API_URL;
  loading = signal(true);
  refinanceItems = signal<Refinance[]>([]);

  ngOnInit(): void {
    this.refinanceSearch();
  }

  refinanceSearch() {
    this.#searchRefinanceService
      .get<Refinance[]>(
        `${this.endpoint}loans-refinance?customerid=${this.searchId()}`,
        {
          headers: {
            authorization: localStorage.getItem('token') || '',
          },
        }
      )
      .pipe(takeUntilDestroyed(this.#destroyRef$))
      .subscribe({
        next: (data) => {
          this.loading.set(false);
          this.refinanceItems.set(data);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onDropdownChange(event: DropdownChangeEvent) {
    this.searchRefinanceResults.emit(event.value);
  }
}
