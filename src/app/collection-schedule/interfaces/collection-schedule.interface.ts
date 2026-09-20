export interface ScheduleAgenda {
  loan_request_id: number;
  utc_datetime_stamp: Date;
  loan_request_utc_date: Date;
  last_change_loan_request_utc_date: Date;
  collection_agent: number;
  request_number: string;
  customer_id: number;
  customer_name: string;
  credit_type: string;
  revision_classification: '1' | '0';
  requested_amount: number;
  authorized_amount: number;
  discount_amount: number;
  customer_neighborhood: string;
  customer_county: string;
  primary_borrower_call_status: string;
  guarantor_call_status: string;
  current_status: string;
  observations: string;
  captured_account: string;
  budget: number;
  real_inversion: number;
  last_change_utc_date: Date;
  modified_by: number;
  accounting_utc_date: Date;
  group_id: number;
  management_id: number;
}

export interface CollectionSchedulePayload {
  loan_request_id: number;
  revision_classification?: string;
  authorized_amount?: number;
  primary_borrower_call_status?: string;
  guarantor_call_status?: string;
  current_status?: string;
  observations?: string;
}

export interface FilterOption {
  ID: number;
  NOMBRE: string;
}

export interface CollectionScheduleResponse {
  data: ScheduleAgenda[];
  management: FilterOption[];
  groups: FilterOption[];
  agents: FilterOption[];
}

export interface TableColumn {
  field: string;
  header: string;
  width: string;
  filterType: string;
}
