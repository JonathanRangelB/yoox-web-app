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
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-refinance-search',
  imports: [CommonModule, TableModule],
  templateUrl: './refinance-search.component.html',
  styles: `
    p-table {
      display: block;
      margin-right: 1.5rem;
    }
  `,
})
export class RefinanceSearchComponent implements OnInit {
  readonly searchId = input.required<string | number>();
  readonly searchRefinanceResults = output<Refinance[]>();
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
          this.searchRefinanceResults.emit(data);
        },
        error: () => {
          this.loading.set(false);
          this.searchRefinanceResults.emit([]);
        },
      });
  }

  onRowSelect(event: TableRowSelectEvent) {
    console.log(event.data);
  }
}
