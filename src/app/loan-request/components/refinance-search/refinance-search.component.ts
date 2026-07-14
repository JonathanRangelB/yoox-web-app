import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Refinance } from './types/refinance';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-refinance-search',
  imports: [DropdownModule, FormsModule],
  templateUrl: './refinance-search.component.html',
})
export class RefinanceSearchComponent implements OnInit {
  readonly searchId = input.required<string | number>();
  readonly selectedRefinance = input<Refinance | null>(null);
  readonly searchRefinanceResults = output<Refinance>();
  readonly #searchRefinanceService = inject(HttpClient);
  readonly #destroyRef$ = inject(DestroyRef);
  endpoint = environment.API_URL;
  loading = signal(true);
  refinanceItems = signal<Refinance[]>([]);
  selectedRefinanceValue?: Refinance;

  constructor() {
    effect(() => {
      this.selectedRefinanceValue = this.selectedRefinance() ?? undefined;
    });
  }

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
          if (data.length > 0) {
            this.selectRefinance(data[0]);
          }
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onDropdownChange(event: DropdownChangeEvent) {
    this.selectRefinance(event.value);
  }

  private selectRefinance(refinance: Refinance) {
    this.selectedRefinanceValue = refinance;
    this.searchRefinanceResults.emit(refinance);
  }
}
