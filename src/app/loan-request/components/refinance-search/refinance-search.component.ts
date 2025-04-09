import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Refinance } from './types/refinance';
import { CommonModule } from '@angular/common';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-refinance-search',
  imports: [CommonModule, TableModule],
  templateUrl: './refinance-search.component.html',
})
export class RefinanceSearchComponent implements OnInit {
  endpoint = environment.API_URL;
  loading = false;
  query = signal<string>(`${this.endpoint}loans-refinance?customerid=146`);
  refinanceItems: Refinance[] = [];
  #searchRefinanceService = inject(HttpClient).get<Refinance[]>(this.query(), {
    headers: {
      authorization: localStorage.getItem('token') || '',
    },
  });
  readonly #destroyRef$ = inject(DestroyRef);

  ngOnInit(): void {
    this.refinanceSearch();
  }

  refinanceSearch() {
    this.#searchRefinanceService
      .pipe(
        takeUntilDestroyed(this.#destroyRef$),
        tap(() => (this.loading = true))
      )
      .subscribe({
        next: (data) => {
          this.refinanceItems = data;
          this.loading = false;
        },
        error: (error) => {
          console.log(error);
          this.refinanceItems = [];
          this.loading = false;
        },
      });
  }

  onRowSelect(event: TableRowSelectEvent) {
    console.log(event.data);
  }
}
