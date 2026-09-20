import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionScheduleComponent } from './collection-schedule.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

describe('CollectionScheduleComponent', () => {
  let component: CollectionScheduleComponent;
  let fixture: ComponentFixture<CollectionScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionScheduleComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
