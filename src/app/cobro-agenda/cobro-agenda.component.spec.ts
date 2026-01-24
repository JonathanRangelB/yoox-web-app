import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CobroAgendaComponent } from './cobro-agenda.component';

describe('CobroAgendaComponent', () => {
  let component: CobroAgendaComponent;
  let fixture: ComponentFixture<CobroAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CobroAgendaComponent, NoopAnimationsModule],
    }).compileComponents();

    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
    };

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));

    fixture = TestBed.createComponent(CobroAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cobros agenda on init', () => {
    expect(component.datosAgenda).toBeDefined();
    expect(component.datosAgenda.length).toBe(0);
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(5000);
    expect(formatted).toBe('$5,000.00');
  });
});
