export interface CollectionScheduleDailyMetrics {
  captured_accounts: number;
  total_budget: number;
  totalReal_investment: number;
  accounting_date: Date;
}

export interface CollectionsPlanner {
  loan_request_id: number;
  insert_utc_datetime_stamp: Date;
  loan_request_utc_date: Date;
  last_change_loan_request_utc_date: Date | null;
  collection_id_agent: number;
  collection_name_agent: string;
  loan_request_number: string;
  customer_id: number | null;
  customer_name: string;
  credit_type: string;
  revised_record: number;
  requested_amount: number;
  authorized_amount: number;
  discount_amount: number;
  customer_neighborhood: string | null;
  customer_county: string | null;
  primary_borrower_call_status: string;
  guarantor_call_status: string;
  current_status: string;
  observations: string | null;
  captured_account: number;
  budget: number;
  real_inversion: number | null;
  last_change_utc_date: Date | null;
  modified_by: number | null;
  accounting_date: Date | null;
  group_id: number | null;
  group_name: string;
  management_id: number | null;
  management_name: string | null;
  close_utc_datetime_stamp: Date | null;
}

export interface CollectionScheduleDashboard {
  dailyMetrics: CollectionScheduleDailyMetrics[];
  records: CollectionsPlanner[];
}

export interface CollectionsPlannerPostRequest {
  id_user: number;
  accounting_date?: string;
}

export interface CollectionsPlannerPatchRequest {
  loan_request_id: number;
  revised_record: number;
  authorized_amount: number;
  primary_borrower_call_status: string;
  guarantor_call_status: string;
  current_status: string;
  observations: string;
  modified_by: number;
}

export interface FilterOption {
  ID: number;
  NOMBRE: string;
}

export interface TableColumn {
  field: string;
  header: string;
  width: string;
  filterType: string;
  filterOptions?: TableTagOption[];
}

export interface TableTagOption {
  label: string;
  value: string | number;
  severity?: 'success' | 'warning' | 'danger' | 'info';
}
