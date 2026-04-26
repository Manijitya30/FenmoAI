export interface Expense {
  id: string;
  amount: number;       
  category: string;
  description: string | null;
  date: string;         
  created_at: string;   
  idempotency_key: string;
}
export interface ExpensesResponse {
  count: number;
  expenses: Expense[];
}
export interface CreateExpensePayload {
  amount: number;
  category: string;
  description: string;
  date: string;
}
export type SortOption = 'date_desc' | 'created_desc';
export interface Filters {
  category: string;
  sort: SortOption;
}
