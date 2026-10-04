import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { getUserFromLocalStorage } from '../shared/utils/functions.utils';
import { ExcelExportService } from '../shared/services/excel-export.service';
import { CollectionScheduleService } from './services/collection-schedule.service';
import {
  CollectionsPlanner,
  FilterOption,
  TableColumn,
} from './interfaces/collection-schedule.interface';

type FilterMode = 'gerencia' | 'grupo' | 'agente';

@Component({
  selector: 'app-collection-schedule',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    SidebarModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    ToastModule,
    DividerModule,
    FieldsetModule,
    ConfirmDialogModule,
    SelectButtonModule,
    CalendarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './collection-schedule.component.html',
  styleUrls: ['./collection-schedule.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionScheduleComponent implements OnInit {
  readonly #service = inject(CollectionScheduleService);
  readonly #messageService = inject(MessageService);
  readonly #excelService = inject(ExcelExportService);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #fb = inject(FormBuilder);

  scheduleData = signal<CollectionsPlanner[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  selectedRecord = signal<CollectionsPlanner | null>(null);
  filterMenuOpen = signal<boolean>(false);
  exporting = signal<boolean>(false);
  selectedAccountingDate = signal<Date>(new Date());
  editForm!: FormGroup;

  currentUser = getUserFromLocalStorage();
  //TODO: Restaurar control de acceso por rol cuando el login provea las gerencias
  // hasAccess = computed(() =>
  //   ['NORMAL', 'ADMINISTRADOR'].includes(this.currentUser?.ROL || '')
  // );
  hasAccess = computed(() => true);

  editSection = viewChild<ElementRef>('editSection');
  tableRef = viewChild<Table>('dt');

  isRecordLocked = computed(() => {
    const status = this.selectedRecord()?.current_status;
    return status === 'AUTORIZADO' || status === 'CANCELADO';
  });

  // Filter mode and lists
  filterMode = signal<FilterMode>('gerencia');
  filterModeOptions = [
    { label: 'Gerencia', value: 'gerencia' },
    { label: 'Grupo', value: 'grupo' },
    { label: 'Agente', value: 'agente' },
  ];

  managementList = signal<FilterOption[]>([]);
  groupList = signal<FilterOption[]>([]);
  agentList = signal<FilterOption[]>([]);
  selectedFilter = signal<FilterOption | null>(null);

  currentFilterList = computed(() => {
    switch (this.filterMode()) {
      case 'gerencia':
        return this.managementList();
      case 'grupo':
        return this.groupList();
      case 'agente':
        return this.agentList();
      default:
        return [];
    }
  });

  currentFilterPlaceholder = computed(() => {
    switch (this.filterMode()) {
      case 'gerencia':
        return 'Seleccionar gerencia';
      case 'grupo':
        return 'Seleccionar grupo';
      case 'agente':
        return 'Seleccionar agente';
      default:
        return 'Seleccionar';
    }
  });

  displayedData = computed(() => {
    const filter = this.selectedFilter();
    if (!filter) return this.scheduleData();

    switch (this.filterMode()) {
      case 'gerencia':
        return this.scheduleData().filter((r) =>
          filter.ID === -1
            ? r.management_id == null
            : r.management_id === filter.ID
        );
      case 'grupo':
        return this.scheduleData().filter((r) => r.group_id === filter.ID);
      case 'agente':
        return this.scheduleData().filter(
          (r) => r.collection_id_agent === filter.ID
        );
      default:
        return this.scheduleData();
    }
  });

  revisionOptions = [
    { label: 'REVISADO', value: 1 },
    { label: 'NO REVISADO', value: 0 },
  ];
  callStatusOptions = ['LLAMADA PENDIENTE', 'NO LOCALIZABLE', 'CONTESTO'];
  currentStatusOptions = [
    'POR DEFINIR',
    'AUTORIZADO',
    'EN ESPERA',
    'CANCELADO',
  ];

  tableColumns: TableColumn[] = [
    {
      field: 'loan_request_id',
      header: 'ID Solicitud',
      width: '8rem',
      filterType: 'numeric',
    },
    {
      field: 'insert_utc_datetime_stamp',
      header: 'Fecha Stamp',
      width: '10rem',
      filterType: 'date',
    },
    {
      field: 'loan_request_utc_date',
      header: 'Fecha Solicitud',
      width: '10rem',
      filterType: 'date',
    },
    {
      field: 'last_change_loan_request_utc_date',
      header: 'Fecha Ult Mod Sol',
      width: '10rem',
      filterType: 'date',
    },
    {
      field: 'collection_id_agent',
      header: 'Agente',
      width: '14rem',
      filterType: 'text',
    },
    {
      field: 'loan_request_number',
      header: 'Folio',
      width: '10rem',
      filterType: 'text',
    },
    {
      field: 'customer_id',
      header: 'Cod Cliente',
      width: '8rem',
      filterType: 'numeric',
    },
    {
      field: 'customer_name',
      header: 'Nombre Cliente',
      width: '15rem',
      filterType: 'text',
    },
    {
      field: 'credit_type',
      header: 'Tipo Credito',
      width: '10rem',
      filterType: 'text',
    },
    {
      field: 'revised_record',
      header: 'Clasificacion',
      width: '10rem',
      filterType: 'numeric',
    },
    {
      field: 'requested_amount',
      header: 'Cant Solicitada',
      width: '10rem',
      filterType: 'numeric',
    },
    {
      field: 'authorized_amount',
      header: 'Autorizado',
      width: '10rem',
      filterType: 'numeric',
    },
    {
      field: 'discount_amount',
      header: 'Descuentos',
      width: '10rem',
      filterType: 'numeric',
    },
    {
      field: 'customer_neighborhood',
      header: 'Colonia',
      width: '12rem',
      filterType: 'text',
    },
    {
      field: 'customer_county',
      header: 'Municipio',
      width: '12rem',
      filterType: 'text',
    },
    {
      field: 'primary_borrower_call_status',
      header: 'Estatus Titular',
      width: '12rem',
      filterType: 'text',
    },
    {
      field: 'guarantor_call_status',
      header: 'Estatus Aval',
      width: '12rem',
      filterType: 'text',
    },
    {
      field: 'current_status',
      header: 'Estatus Actual',
      width: '12rem',
      filterType: 'text',
    },
    {
      field: 'observations',
      header: 'Observaciones',
      width: '15rem',
      filterType: 'text',
    },
    {
      field: 'captured_account',
      header: 'Cuenta Capturada',
      width: '10rem',
      filterType: 'numeric',
    },
    {
      field: 'budget',
      header: 'Presupuesto',
      width: '10rem',
      filterType: 'numeric',
    },
    {
      field: 'real_inversion',
      header: 'Inversion Real',
      width: '10rem',
      filterType: 'numeric',
    },
    {
      field: 'last_change_utc_date',
      header: 'Fecha Ult Revision',
      width: '10rem',
      filterType: 'date',
    },
    {
      field: 'modified_by',
      header: 'Modificado Por',
      width: '10rem',
      filterType: 'numeric',
    },
    {
      field: 'accounting_date',
      header: 'Fecha Contabilizacion',
      width: '10rem',
      filterType: 'date',
    },
    {
      field: 'group_name',
      header: 'Grupo',
      width: '12rem',
      filterType: 'text',
    },
    {
      field: 'management_name',
      header: 'Gerencia',
      width: '12rem',
      filterType: 'text',
    },
    {
      field: 'close_utc_datetime_stamp',
      header: 'Fecha Cierre',
      width: '10rem',
      filterType: 'date',
    },
  ];

  globalFilterFields = [
    ...this.tableColumns.map((c) => c.field),
    'group_id',
    'management_id',
    'collection_name_agent',
  ];

  totalCapturedAccounts = computed(
    () => this.displayedData().filter((r) => !!r.captured_account).length
  );
  totalBudget = computed(() =>
    this.displayedData().reduce(
      (sum, r) => sum + ((r.authorized_amount || 0) - (r.discount_amount || 0)),
      0
    )
  );
  totalRealInversion = computed(() =>
    this.displayedData()
      .filter((r) => r.captured_account === 1)
      .reduce((sum, r) => sum + (r.real_inversion || 0), 0)
  );
  latestAccountingDate = computed(() => {
    const dates = this.displayedData()
      .map((r) => r.accounting_date)
      .filter(Boolean);
    return dates.length
      ? new Date(Math.max(...dates.map((d) => new Date(d).getTime())))
      : null;
  });

  ngOnInit(): void {
    //TODO: Restaurar control de acceso por rol cuando el login provea las gerencias
    // if (this.hasAccess()) {
    //   this.loadData();
    // }
    this.selectedAccountingDate.set(new Date());
    this.loadData();
  }

  private buildPayload(): { id_user: number } {
    const user = getUserFromLocalStorage();
    const date = this.selectedAccountingDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return {
      id_user: user?.ID ?? 0,
      // accounting_date: `${year}-${month}-${day}`,
    };
  }

  loadData(): void {
    this.loading.set(true);
    const payload = this.buildPayload();
    this.#service.getCollectionSchedule(payload).subscribe({
      next: (data) => {
        this.selectedFilter.set(null);
        this.tableRef()?.reset();
        this.scheduleData.set(data);
        this.buildFilterLists(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.#messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrio un error al recuperar los registros',
        });
        console.error({ err });
        this.loading.set(false);
      },
    });
  }

  private buildFilterLists(data: CollectionsPlanner[]): void {
    const managementMap = new Map<number, string>();
    const groupMap = new Map<number, string>();
    const agentMap = new Map<number, string>();
    let hasNullManagement = false;

    data.forEach((item) => {
      if (item.management_id == null) {
        hasNullManagement = true;
      } else if (!managementMap.has(item.management_id)) {
        managementMap.set(item.management_id, item.management_name);
      }
      if (!groupMap.has(item.group_id)) {
        groupMap.set(item.group_id, item.group_name);
      }
      if (!agentMap.has(item.collection_id_agent)) {
        agentMap.set(item.collection_id_agent, item.collection_name_agent);
      }
    });

    const managementOptions = Array.from(managementMap.entries())
      .map(([ID, name]) => ({ ID, NOMBRE: `${ID} - ${name}` }))
      .sort((a, b) => a.ID - b.ID);

    if (hasNullManagement) {
      managementOptions.push({ ID: -1, NOMBRE: 'SIN GERENCIA' });
    }

    this.managementList.set(managementOptions);

    this.groupList.set(
      Array.from(groupMap.entries())
        .map(([ID, name]) => ({ ID, NOMBRE: `${ID} - ${name}` }))
        .sort((a, b) => a.ID - b.ID)
    );

    this.agentList.set(
      Array.from(agentMap.entries())
        .map(([ID, name]) => ({ ID, NOMBRE: `${ID} - ${name}` }))
        .sort((a, b) => a.ID - b.ID)
    );
  }

  onFilterModeChange(): void {
    this.selectedFilter.set(null);
  }

  onRowSelect(record: CollectionsPlanner): void {
    const normalizedRecord: CollectionsPlanner = {
      ...record,
      revised_record: record.revised_record === 1 ? 1 : 0,
      primary_borrower_call_status:
        record.primary_borrower_call_status || 'LLAMADA PENDIENTE',
      guarantor_call_status:
        record.guarantor_call_status || 'LLAMADA PENDIENTE',
    };

    this.selectedRecord.set(normalizedRecord);
    this.buildForm(normalizedRecord);
    setTimeout(() => {
      this.editSection()?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  private buildForm(record: CollectionsPlanner): void {
    const authorizedAmount =
      record.authorized_amount && record.authorized_amount > 0
        ? record.authorized_amount
        : 1000;

    const locked = this.isRecordLocked();

    this.editForm = this.#fb.group({
      revised_record: [{ value: record.revised_record, disabled: locked }],
      primary_borrower_call_status: [
        { value: record.primary_borrower_call_status, disabled: locked },
      ],
      guarantor_call_status: [
        { value: record.guarantor_call_status, disabled: locked },
      ],
      current_status: [{ value: record.current_status, disabled: locked }],
      observations: [{ value: record.observations, disabled: locked }],
      authorized_amount: [
        { value: authorizedAmount, disabled: locked },
        [Validators.min(1000)],
      ],
    });
  }

  cancelEdit(): void {
    this.selectedRecord.set(null);
  }

  confirmSave(): void {
    const record = this.selectedRecord();
    if (!record) return;

    const isCancel = record.current_status === 'CANCELADO';

    this.#confirmationService.confirm({
      message: isCancel
        ? 'Esta acción eliminará el registro de la tabla de forma <span style="color: #ef4444; font-weight: 600;">permanente e irreversible</span>. ¿Está seguro de que desea continuar?'
        : '¿Está seguro de que desea guardar los cambios?',
      header: isCancel
        ? 'Confirmar eliminación permanente'
        : 'Confirmar guardado',
      icon: isCancel ? 'pi pi-trash' : 'pi pi-exclamation-circle',
      acceptLabel: isCancel ? 'Sí, eliminar' : 'Sí, guardar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: isCancel ? 'p-button-danger' : undefined,
      accept: () => this.executeSave(),
    });
  }

  executeSave(): void {
    const record = this.selectedRecord();
    if (!record || this.editForm.invalid) return;

    const formValue = this.editForm.value;
    this.saving.set(true);
    this.#service
      .updateRecord({
        loan_request_id: record.loan_request_id,
        revised_record: formValue.revised_record,
        authorized_amount: formValue.authorized_amount,
        primary_borrower_call_status: formValue.primary_borrower_call_status,
        guarantor_call_status: formValue.guarantor_call_status,
        current_status: formValue.current_status,
        observations: formValue.observations,
        modified_by: this.currentUser?.ID ?? 0,
        remote_utc_local_datetime: new Date()
      })
      .subscribe({
        next: (updated) => {
          if (updated.current_status === 'CANCELADO') {
            this.scheduleData.update((list) =>
              list.filter(
                (item) => item.loan_request_id !== updated.loan_request_id
              )
            );
          } else {
            this.scheduleData.update((list) =>
              list.map((item) =>
                item.loan_request_id === updated.loan_request_id
                  ? updated
                  : item
              )
            );
          }
          this.selectedRecord.set(null);
          this.saving.set(false);
          this.#messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail:
              updated.current_status === 'CANCELADO'
                ? 'Registro eliminado correctamente'
                : 'Registro actualizado correctamente',
          });
        },
        error: ({ error, message }) => {
          this.saving.set(false);
          this.#messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
          console.log({ error, message });
        },
      });
  }

  formatCurrency(value: number | null | undefined): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value || 0);
  }

  truncateText(value: string | null | undefined): string {
    if (!value) return '';
    if (value.length <= 20) return value;
    return value.substring(0, 20) + '...';
  }

  onGlobalFilter(event: Event, dt: Table): void {
    const target = event.target as HTMLInputElement;
    dt.filterGlobal(target.value, 'contains');
  }

  resetTable(table: Table): void {
    table.reset();
  }

  refreshData(): void {
    this.loadData();
  }

  applyDateFilter(): void {
    this.loadData();
  }

  getStatusSeverity(
    status: string
  ): 'success' | 'warning' | 'danger' | 'info' | undefined {
    switch (status) {
      case 'AUTORIZADO':
        return 'success';
      case 'CANCELADO':
        return 'danger';
      case 'EN ESPERA':
        return 'warning';
      case 'POR DEFINIR':
        return 'info';
      default:
        return undefined;
    }
  }

  getStatusTooltip(status: string): string {
    switch (status) {
      case 'AUTORIZADO':
        return 'Este registro ya no puede ser modificado porque su estatus es AUTORIZADO';
      case 'CANCELADO':
        return 'Este registro ya no puede ser modificado porque su estatus es CANCELADO';
      case 'EN ESPERA':
        return 'Este registro está en espera de revisión y puede ser modificado';
      case 'POR DEFINIR':
        return 'Este registro aún no tiene un estatus definido y puede ser modificado';
      default:
        return 'Estatus del registro';
    }
  }

  async exportAll(): Promise<void> {
    const data = this.scheduleData();
    if (data.length === 0) return;
    this.exporting.set(true);
    const dateStr = new Date().toISOString().split('T')[0];
    await this.#excelService.exportToExcel(
      data,
      `planificador-cobranza-completa_${dateStr}`
    );
    this.exporting.set(false);
  }

  async exportFiltered(table: Table): Promise<void> {
    const filtered = table.filteredValue as CollectionsPlanner[] | undefined;
    const dataToExport = filtered ?? this.displayedData();
    if (dataToExport.length === 0) {
      this.#messageService.add({
        severity: 'warn',
        summary: 'No hay datos para exportar',
        detail:
          'Tabla vacía o filtros aplicados no coinciden con ningún registro.',
        life: 3000,
      });
      return;
    }
    this.exporting.set(true);
    const dateStr = new Date().toISOString().split('T')[0];
    await this.#excelService.exportToExcel(
      dataToExport,
      `planificador-cobranza-filtrada_${dateStr}`
    );
    this.exporting.set(false);
  }
}
