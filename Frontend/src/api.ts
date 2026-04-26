import type { CreateExpensePayload, Expense, ExpensesResponse, Filters } from './types';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const BASE = `${BASE_URL}/expenses`;
export async function fetchExpenses(filters: Filters): Promise<Expense[]> {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.sort === 'date_desc') params.set('sort', 'date_desc');
  const url = params.toString() ? `${BASE}?${params}` : BASE;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Server error ${res.status}`);
  }
  const data: ExpensesResponse = await res.json();
  return data.expenses;
}
export async function createExpense(payload: CreateExpensePayload): Promise<Expense> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': uuidv4(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      body.details?.join(', ') ?? body.error ?? `Server error ${res.status}`;
    throw new Error(message);
  }
  const data = await res.json();
  return data.expense as Expense;
}
