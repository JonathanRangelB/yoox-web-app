import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionScheduleComponent } from './collection-schedule.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

const mockUser = {
  ID: 1,
  NOMBRE: 'Test User',
  ROL: 'ADMINISTRADOR',
  ACTIVO: true,
  ID_GRUPO: null,
  ID_ROL: 1,
  iat: 1234567890,
  exp: 1234567890,
};

describe('CollectionScheduleComponent', () => {
  let component: CollectionScheduleComponent;
  let fixture: ComponentFixture<CollectionScheduleComponent>;

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user') return JSON.stringify(mockUser);
      if (key === 'token') return 'mock-token';
      return null;
    });

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
