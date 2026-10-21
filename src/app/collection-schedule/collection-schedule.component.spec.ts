import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { CollectionScheduleComponent } from './collection-schedule.component';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { ColumnFilter } from 'primeng/table';
import { of } from 'rxjs';
import { CollectionScheduleService } from './services/collection-schedule.service';
import {
  CollectionScheduleDashboard,
  CollectionsPlanner,
} from './interfaces/collection-schedule.interface';

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
  let service: jasmine.SpyObj<CollectionScheduleService>;

  const makeRecord = (
    overrides: Partial<CollectionsPlanner> = {}
  ): CollectionsPlanner => ({
    loan_request_id: 1,
    insert_utc_datetime_stamp: new Date('2026-10-20T00:00:00Z'),
    loan_request_utc_date: new Date('2026-10-20T23:00:00Z'),
    last_change_loan_request_utc_date: null,
    collection_id_agent: 1,
    collection_name_agent: 'Agente',
    loan_request_number: 'SOL-1',
    customer_id: 1,
    customer_name: 'Cliente',
    credit_type: 'NUEVO',
    revised_record: 0,
    requested_amount: 2000,
    authorized_amount: 2000,
    discount_amount: 100,
    customer_neighborhood: null,
    customer_county: null,
    primary_borrower_call_status: 'LLAMADA PENDIENTE',
    guarantor_call_status: 'LLAMADA PENDIENTE',
    current_status: 'AUTORIZADO',
    observations: null,
    captured_account: 0,
    budget: 1900,
    real_inversion: null,
    last_change_utc_date: null,
    modified_by: null,
    accounting_date: new Date('2026-10-20T00:00:00Z'),
    group_id: 1,
    group_name: 'Grupo',
    management_id: 1,
    management_name: 'Gerencia',
    close_utc_datetime_stamp: null,
    ...overrides,
  });

  const makeMetric = (date: string) => ({
    accounting_date: new Date(date),
    captured_accounts: 0,
    total_budget: 0,
    totalReal_investment: 0,
  });

  beforeAll(() => registerLocaleData(localeEsMx));

  beforeEach(async () => {
    service = jasmine.createSpyObj<CollectionScheduleService>(
      'CollectionScheduleService',
      ['getCollectionSchedule', 'updateRecord']
    );
    service.getCollectionSchedule.and.returnValue(
      of({ records: [], dailyMetrics: [] })
    );
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user') return JSON.stringify(mockUser);
      if (key === 'token') return 'mock-token';
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [CollectionScheduleComponent],
      providers: [
        provideNoopAnimations(),
        { provide: CollectionScheduleService, useValue: service },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('allows editing and saving an authorized account pending capture', fakeAsync(() => {
    const record = makeRecord();
    service.updateRecord.and.returnValue(of(record));
    component.onRowSelect(record);
    tick(100);
    fixture.detectChanges();

    expect(component.editForm.enabled).toBeTrue();
    const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'p-button[label="Guardar"] button'
    );
    expect(saveButton.disabled).toBeFalse();

    component.editForm.patchValue({ observations: 'Pendiente de captura' });
    component.executeSave();
    expect(service.updateRecord).toHaveBeenCalledWith(
      jasmine.objectContaining({
        loan_request_id: record.loan_request_id,
        current_status: 'AUTORIZADO',
        observations: 'Pendiente de captura',
      })
    );
  }));

  [
    { current_status: 'AUTORIZADO', captured_account: 1 },
    { current_status: 'CANCELADO', captured_account: 0 },
    { current_status: 'CANCELADO', captured_account: 1 },
  ].forEach((state) => {
    it(`blocks ${state.current_status} with captured_account ${state.captured_account}`, fakeAsync(() => {
      const confirmation = spyOn(
        fixture.debugElement.injector.get(ConfirmationService),
        'confirm'
      );
      component.onRowSelect(makeRecord(state));
      tick(100);
      fixture.detectChanges();

      expect(component.editForm.disabled).toBeTrue();
      const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
        'p-button[label="Guardar"] button'
      );
      expect(saveButton.disabled).toBeTrue();
      component.confirmSave();
      component.executeSave();
      expect(confirmation).not.toHaveBeenCalled();
      expect(service.updateRecord).not.toHaveBeenCalled();
    }));
  });

  it('keeps the minimum amount validation for authorized accounts pending capture', fakeAsync(() => {
    component.onRowSelect(makeRecord({ authorized_amount: 999 }));
    tick(100);
    fixture.detectChanges();

    expect(component.editForm.invalid).toBeTrue();
    const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'p-button[label="Guardar"] button'
    );
    expect(saveButton.disabled).toBeTrue();
    component.executeSave();
    expect(service.updateRecord).not.toHaveBeenCalled();
  }));

  it('filters tag values exactly, including numeric zero, and clears them', fakeAsync(() => {
    const pending = makeRecord();
    const reviewed = makeRecord({
      loan_request_id: 2,
      revised_record: 1,
      primary_borrower_call_status: 'CONTESTO',
      guarantor_call_status: 'NO LOCALIZABLE',
      current_status: 'EN ESPERA',
    });
    component.scheduleData.set([pending, reviewed]);
    fixture.detectChanges();
    const table = component.tableRef()!;
    const fields = [
      'revised_record',
      'primary_borrower_call_status',
      'guarantor_call_status',
      'current_status',
    ] as const;

    for (const field of fields) {
      const column = component.tableColumns.find((col) => col.field === field)!;
      const option = column.filterOptions!.find(
        (item) => item.value === pending[field]
      )!;
      const columnFilter = fixture.debugElement
        .queryAll(By.directive(ColumnFilter))
        .find((element) => element.componentInstance.field === field)!;
      const menuButton: HTMLButtonElement =
        columnFilter.nativeElement.querySelector('button');
      menuButton.click();
      fixture.detectChanges();
      const dropdown = fixture.debugElement
        .queryAll(By.directive(Dropdown))
        .map((element) => element.componentInstance as Dropdown)
        .find((item) => item.ariaLabel === 'Filtrar ' + column.header)!;
      dropdown.onChange.emit({
        originalEvent: new Event('change'),
        value: option.value,
      });
      tick(table.filterDelay);
      expect(table.filteredValue).toEqual([pending]);
      dropdown.onChange.emit({
        originalEvent: new Event('change'),
        value: null,
      });
      tick(table.filterDelay);
      expect(table.filteredValue ?? table.value).toEqual([pending, reviewed]);
      menuButton.click();
      fixture.detectChanges();
      tick();
    }
  }));

  it('formats UTC midnight summary dates without moving to the previous day', () => {
    const dashboard: CollectionScheduleDashboard = {
      records: [],
      dailyMetrics: [
        makeMetric('2027-01-01T00:00:00Z'),
        makeMetric('2026-11-01T00:00:00Z'),
      ],
    };
    service.getCollectionSchedule.and.returnValue(of(dashboard));
    component.loadData();

    expect(
      component.dailyMetricOptions().map((option) => option.label)
    ).toEqual(['1 ene del 2027', '1 nov del 2026']);
  });

  it('selects the local calendar day even when UTC is already tomorrow', () => {
    jasmine.clock().install();
    try {
      jasmine.clock().mockDate(new Date(2026, 9, 20, 23, 30));
      const tomorrow = makeMetric('2026-10-21T00:00:00Z');
      const today = makeMetric('2026-10-20T00:00:00Z');
      service.getCollectionSchedule.and.returnValue(
        of({ records: [], dailyMetrics: [tomorrow, today] })
      );
      component.loadData();

      expect(component.selectedDailyMetric()).toBe(today);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('recalculates summary totals using UTC days and preserves the selection', fakeAsync(() => {
    const record = makeRecord();
    const metric = makeMetric('2026-10-20T00:00:00Z');
    service.getCollectionSchedule.and.returnValue(
      of({ records: [record], dailyMetrics: [metric] })
    );
    component.loadData();
    service.updateRecord.and.returnValue(of(record));
    component.onRowSelect(record);
    tick(100);
    component.executeSave();

    expect(component.selectedDailyMetric()).toEqual({
      ...metric,
      total_budget: 1900,
    });
  }));
});
