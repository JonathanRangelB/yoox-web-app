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

  it('should get correct estatus severity', () => {
    expect(component.getEstatusSeverity('pagado')).toBe('success');
    expect(component.getEstatusSeverity('pendiente')).toBe('info');
    expect(component.getEstatusSeverity('vencido')).toBe('danger');
    expect(component.getEstatusSeverity('parcial')).toBe('warning');
  });

  it('should get correct estatus label', () => {
    expect(component.getEstatusLabel('pagado')).toBe('Pagado');
    expect(component.getEstatusLabel('pendiente')).toBe('Pendiente');
    expect(component.getEstatusLabel('vencido')).toBe('Vencido');
    expect(component.getEstatusLabel('parcial')).toBe('Parcial');
  });

  it('should get count by estatus', () => {
    expect(component.getCountByEstatus('pagado')).toBe(0);
    expect(component.getCountByEstatus('pendiente')).toBe(0);
    expect(component.getCountByEstatus('vencido')).toBe(0);
    expect(component.getCountByEstatus('parcial')).toBe(0);
  });
});
