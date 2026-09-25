export interface CollectionsPlanner {
  loan_request_id: number;
  insert_utc_datetime_stamp: Date;
  loan_request_utc_date: Date;
  last_change_loan_request_utc_date: Date;
  collection_id_agent: number;
  collection_name_agent: string;
  loan_request_number: string;
  customer_id: number;
  customer_name: string;
  credit_type: string;
  revised_record: number;
  requested_amount: number;
  authorized_amount: number;
  discount_amount: number;
  customer_neighborhood: string;
  customer_county: string;
  primary_borrower_call_status: string;
  guarantor_call_status: string;
  current_status: string;
  observations: string;
  captured_account: number;
  budget: number;
  real_inversion: number;
  last_change_utc_date: Date;
  modified_by: number;
  accounting_date: Date;
  group_id: number;
  group_name: string;
  management_id: number;
  management_name: string;
  close_utc_datetime_stamp: Date;
}

export interface CollectionsPlannerPostRequest {
  id_user: number;
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
  remote_utc_local_datetime: Date;
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
}
