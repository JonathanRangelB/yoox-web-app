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
import { Calendar } from 'primeng/calendar';
import { ColumnFilter } from 'primeng/table';
import { of, Subject } from 'rxjs';
import { CollectionScheduleService } from './services/collection-schedule.service';
import { ExcelExportService } from '../shared/services/excel-export.service';
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
  let confirmation: jasmine.Spy<ConfirmationService['confirm']>;

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
    confirmation = spyOn(
      fixture.debugElement.injector.get(ConfirmationService),
      'confirm'
    );
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
    saveButton.click();
    expect(service.updateRecord).not.toHaveBeenCalled();
    const dialog = confirmation.calls.mostRecent().args[0];
    expect(dialog.header).toBe('Confirmar guardado');
    dialog.accept?.();
    expect(service.updateRecord).toHaveBeenCalledWith(
      jasmine.objectContaining({
        loan_request_id: record.loan_request_id,
        current_status: 'AUTORIZADO',
        observations: 'Pendiente de captura',
      })
    );
    expect(service.updateRecord).toHaveBeenCalledTimes(1);
    expect(component.selectedRecord()).toBeNull();
    expect(component.saving()).toBeFalse();
  }));

  it('does not save when the confirmation dialog is rejected', fakeAsync(() => {
    confirmation.and.callThrough();
    component.onRowSelect(makeRecord());
    tick(100);
    component.confirmSave();
    fixture.detectChanges();
    tick();

    const rejectButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.p-confirm-dialog-reject'
    );
    rejectButton.click();
    fixture.detectChanges();
    tick();

    expect(service.updateRecord).not.toHaveBeenCalled();
    expect(component.selectedRecord()).not.toBeNull();
    expect(component.saving()).toBeFalse();
  }));

  it('ignores repeated confirmation while a save is in progress', fakeAsync(() => {
    const response = new Subject<CollectionsPlanner>();
    const record = makeRecord();
    service.updateRecord.and.returnValue(response);
    component.onRowSelect(record);
    tick(100);
    component.confirmSave();
    const accept = confirmation.calls.mostRecent().args[0].accept!;

    accept();
    expect(component.saving()).toBeTrue();
    expect(component.canSave()).toBeFalse();
    accept();
    component.confirmSave();
    expect(service.updateRecord).toHaveBeenCalledTimes(1);
    expect(confirmation).toHaveBeenCalledTimes(1);

    response.next(record);
    response.complete();
    expect(component.saving()).toBeFalse();
  }));

  it('rechecks validation when accepting a pending confirmation', fakeAsync(() => {
    component.onRowSelect(makeRecord());
    tick(100);
    component.confirmSave();
    const accept = confirmation.calls.mostRecent().args[0].accept!;

    component.editForm.patchValue({ authorized_amount: 999 });
    accept();
    expect(service.updateRecord).not.toHaveBeenCalled();
  }));

  it('ignores an old confirmation after another record is selected', fakeAsync(() => {
    component.onRowSelect(makeRecord());
    tick(100);
    component.confirmSave();
    const accept = confirmation.calls.mostRecent().args[0].accept!;

    component.onRowSelect(makeRecord({ loan_request_id: 2 }));
    tick(100);
    accept();
    expect(service.updateRecord).not.toHaveBeenCalled();
  }));

  [
    { current_status: 'AUTORIZADO', captured_account: 1 },
    { current_status: 'CANCELADO', captured_account: 0 },
    { current_status: 'CANCELADO', captured_account: 1 },
  ].forEach((state) => {
    it(`blocks ${state.current_status} with captured_account ${state.captured_account}`, fakeAsync(() => {
      component.onRowSelect(makeRecord(state));
      tick(100);
      fixture.detectChanges();

      expect(component.editForm.disabled).toBeTrue();
      const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
        'p-button[label="Guardar"] button'
      );
      expect(saveButton.disabled).toBeTrue();
      component.confirmSave();
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
    component.confirmSave();
    expect(confirmation).not.toHaveBeenCalled();
    expect(service.updateRecord).not.toHaveBeenCalled();
  }));

  [null, 0, 999].forEach((amount) => {
    it(`allows cancellation with amount ${amount} and restores validation for other statuses`, fakeAsync(() => {
      const record = makeRecord();
      component.onRowSelect(record);
      tick(100);
      component.editForm.patchValue({ authorized_amount: amount });
      component.editForm.patchValue({ current_status: 'CANCELADO' });
      fixture.detectChanges();

      const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
        'p-button[label="Guardar"] button'
      );
      expect(saveButton.disabled).toBeFalse();
      component.confirmSave();
      expect(confirmation).toHaveBeenCalled();
      expect(confirmation.calls.mostRecent().args[0].header).toBe(
        'Confirmar eliminación permanente'
      );

      for (const status of ['POR DEFINIR', 'EN ESPERA', 'AUTORIZADO']) {
        component.editForm.patchValue({ current_status: status });
        fixture.detectChanges();
        expect(saveButton.disabled).toBeTrue();
        component.confirmSave();
        expect(service.updateRecord).not.toHaveBeenCalled();
      }

      component.editForm.patchValue({ current_status: 'CANCELADO' });
      service.updateRecord.and.returnValue(
        of(makeRecord({ current_status: 'CANCELADO' }))
      );
      component.confirmSave();
      confirmation.calls.mostRecent().args[0].accept?.();
      expect(service.updateRecord).toHaveBeenCalledWith(
        jasmine.objectContaining({
          current_status: 'CANCELADO',
          authorized_amount: amount,
        })
      );
    }));
  });

  it('filters every date column by its displayed calendar day from JSON strings', fakeAsync(() => {
    const dateColumns = component.tableColumns.filter(
      (column) => column.filterType === 'date'
    );
    const record = makeRecord(
      Object.fromEntries(
        dateColumns.map(({ field }) => [field, '2026-09-19T00:30:00Z'])
      )
    );
    const sameDay = makeRecord({
      ...record,
      loan_request_id: 2,
      ...Object.fromEntries(
        dateColumns.map(({ field }) => [field, '2026-09-19T00:45:00Z'])
      ),
    });
    const noDates = makeRecord({
      loan_request_id: 4,
      ...Object.fromEntries(dateColumns.map(({ field }) => [field, null])),
    });
    component.scheduleData.set([
      record,
      sameDay,
      makeRecord({
        loan_request_id: 3,
        ...Object.fromEntries(
          dateColumns.map(({ field }) => [field, '2026-10-20T00:00:00Z'])
        ),
      }),
      noDates,
    ]);
    fixture.detectChanges();
    const table = component.tableRef()!;

    for (const { field } of dateColumns) {
      const instant = new Date('2026-09-19T00:30:00Z');
      const selectedDate =
        field === 'accounting_date'
          ? new Date(2026, 8, 19)
          : new Date(
              instant.getFullYear(),
              instant.getMonth(),
              instant.getDate()
            );
      table.filter(selectedDate, `${field}_filter`, 'dateIs');
      tick(table.filterDelay);
      expect(table.filteredValue?.map((item) => item.loan_request_id))
        .withContext(field)
        .toEqual([1, 2]);
      table.filter(selectedDate, `${field}_filter`, 'dateAfter');
      tick(table.filterDelay);
      expect(table.filteredValue?.map((item) => item.loan_request_id))
        .withContext(`${field} after`)
        .toEqual([3]);
      table.filter(selectedDate, `${field}_filter`, 'dateIsNot');
      tick(table.filterDelay);
      expect(table.filteredValue?.map((item) => item.loan_request_id))
        .withContext(`${field} is not`)
        .toEqual([3]);
      table.filter(new Date(2026, 9, 1), `${field}_filter`, 'dateBefore');
      tick(table.filterDelay);
      expect(table.filteredValue?.map((item) => item.loan_request_id))
        .withContext(`${field} before`)
        .toEqual([1, 2]);
      table.clear();
      tick(table.filterDelay);
    }
    expect(component.scheduleData()[0]).toBe(record);
    expect(record.accounting_date as unknown).toBe('2026-09-19T00:30:00Z');
  }));

  ['2026-09-19', '2026-09-19T00:30:00', '2026-09-19T00:30:00Z'].forEach(
    (dateValue) => {
      it(`filters ${dateValue} by selecting a day in each column calendar`, fakeAsync(() => {
        const dateColumns = component.tableColumns.filter(
          (column) => column.filterType === 'date'
        );
        const record = makeRecord(
          Object.fromEntries(dateColumns.map(({ field }) => [field, dateValue]))
        );
        component.scheduleData.set([
          record,
          makeRecord({ loan_request_id: 2 }),
        ]);
        fixture.detectChanges();
        const table = component.tableRef()!;

        for (const { field } of dateColumns) {
          const columnFilter = fixture.debugElement
            .queryAll(By.directive(ColumnFilter))
            .find(
              (element) => element.componentInstance.field === `${field}_filter`
            )!;
          const menuButton: HTMLButtonElement =
            columnFilter.nativeElement.querySelector('button');
          menuButton.click();
          fixture.detectChanges();
          tick();

          const calendarElement = fixture.debugElement.query(
            By.directive(Calendar)
          );
          const calendar = calendarElement.componentInstance as Calendar;
          calendar.defaultDate = new Date(2026, 8, 19);
          const input: HTMLInputElement =
            calendarElement.nativeElement.querySelector('input');
          input.dispatchEvent(new Event('focus'));
          fixture.detectChanges();
          tick(200);
          fixture.detectChanges();

          const expectedDay =
            dateValue.endsWith('Z') && field !== 'accounting_date'
              ? new Date(dateValue).getDate()
              : 19;
          const day = Array.from(
            document.querySelectorAll<HTMLElement>(
              '.p-datepicker-calendar td:not(.p-datepicker-other-month) span'
            )
          ).find(
            (element) => element.textContent?.trim() === `${expectedDay}`
          )!;
          expect(day).withContext(`${field}: calendar day`).toBeTruthy();
          day.click();
          fixture.detectChanges();
          tick(200);

          expect(table.filteredValue?.map((item) => item.loan_request_id))
            .withContext(field)
            .toEqual([record.loan_request_id]);

          menuButton.click();
          table.clear();
          fixture.detectChanges();
          tick(200);
        }
        expect(component.scheduleData()[0]).toBe(record);
      }));
    }
  );

  it('filters tag values exactly, including numeric zero, and clears them', fakeAsync(() => {
    const pending = makeRecord();
    const reviewed = makeRecord({
      loan_request_id: 2,
      revised_record: 1,
      credit_type: 'RENOVACION',
      primary_borrower_call_status: 'CONTESTO',
      guarantor_call_status: 'NO LOCALIZABLE',
      current_status: 'EN ESPERA',
    });
    component.scheduleData.set([pending, reviewed]);
    fixture.detectChanges();
    const table = component.tableRef()!;
    const fields = [
      'credit_type',
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
      expect(table.filteredValue).toEqual([jasmine.objectContaining(pending)]);
      dropdown.onChange.emit({
        originalEvent: new Event('change'),
        value: null,
      });
      tick(table.filterDelay);
      expect(table.filteredValue ?? table.value).toEqual([
        jasmine.objectContaining(pending),
        jasmine.objectContaining(reviewed),
      ]);
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

  it('exports filtered original records without auxiliary date fields', async () => {
    const record = makeRecord();
    const exportExcel = spyOn(
      fixture.debugElement.injector.get(ExcelExportService),
      'exportToExcel'
    ).and.resolveTo();
    component.scheduleData.set([record, makeRecord({ loan_request_id: 2 })]);
    fixture.detectChanges();
    const table = component.tableRef()!;
    table.filteredValue = [component.tableData()[0]];

    await component.exportFiltered(table);

    expect(exportExcel).toHaveBeenCalledWith([record], jasmine.any(String));
    expect(exportExcel.calls.mostRecent().args[0][0]).toBe(record);
  });

  it('exports all original records with the complete export filename', async () => {
    const records = [makeRecord(), makeRecord({ loan_request_id: 2 })];
    const exportExcel = spyOn(
      fixture.debugElement.injector.get(ExcelExportService),
      'exportToExcel'
    ).and.resolveTo();
    component.scheduleData.set(records);

    await component.exportAll();

    expect(exportExcel).toHaveBeenCalledWith(
      records,
      jasmine.stringMatching(
        /^planificador-cobranza-completa_\d{4}-\d{2}-\d{2}$/
      )
    );
    expect(component.exporting()).toBeFalse();
  });

  it('resets the exporting state when Excel generation fails', async () => {
    const failure = new Error('Export failed');
    spyOn(
      fixture.debugElement.injector.get(ExcelExportService),
      'exportToExcel'
    ).and.rejectWith(failure);
    component.scheduleData.set([makeRecord()]);

    await expectAsync(component.exportAll()).toBeRejectedWith(failure);

    expect(component.exporting()).toBeFalse();
  });

  it('builds unique sorted filter lists and preserves the no-management option', () => {
    const records = [
      makeRecord({
        collection_id_agent: 2,
        collection_name_agent: 'Segundo',
        group_id: 2,
        group_name: 'Segundo',
        management_id: 2,
        management_name: 'Segunda',
      }),
      makeRecord(),
      makeRecord({ management_id: null, management_name: null }),
    ];
    service.getCollectionSchedule.and.returnValue(
      of({ records, dailyMetrics: [] })
    );

    component.loadData();

    expect(component.agentList()).toEqual([
      { ID: 1, NOMBRE: '1 - Agente' },
      { ID: 2, NOMBRE: '2 - Segundo' },
    ]);
    expect(component.groupList()).toEqual([
      { ID: 1, NOMBRE: '1 - Grupo' },
      { ID: 2, NOMBRE: '2 - Segundo' },
    ]);
    expect(component.managementList()).toEqual([
      { ID: 1, NOMBRE: '1 - Gerencia' },
      { ID: 2, NOMBRE: '2 - Segunda' },
      { ID: -1, NOMBRE: 'SIN GERENCIA' },
    ]);
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
    component.confirmSave();
    confirmation.calls.mostRecent().args[0].accept?.();

    expect(component.selectedDailyMetric()).toEqual({
      ...metric,
      total_budget: 1900,
    });
  }));
});
