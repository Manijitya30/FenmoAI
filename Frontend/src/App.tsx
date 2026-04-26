import { useEffect, useState, useCallback } from 'react';
import { Loader2, RefreshCw, ReceiptText, WifiOff } from 'lucide-react';
import { fetchExpenses } from './api';
import type { Expense, Filters } from './types';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseCard from './components/ExpenseCard';
import FilterBar from './components/FilterBar';
import SummaryBar from './components/SummaryBar';
export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ category: '', sort: 'created_desc' });
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses(filters);
      setExpenses(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);
  const handleCreated = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-sky-700/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-fuchsia-700/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <ReceiptText size={18} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Fenmo</h1>
          </div>
          <p className="text-slate-400 text-sm pl-12">Track every rupee, effortlessly.</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <aside>
            <AddExpenseForm onCreated={handleCreated} />
          </aside>
          <main className="space-y-5">
            <SummaryBar expenses={expenses} />
            <div className="flex items-center justify-between flex-wrap gap-3">
              <FilterBar filters={filters} onChange={setFilters} />
              <button
                onClick={loadExpenses}
                disabled={loading}
                title="Refresh"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition disabled:opacity-40"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
            {loading && (
              <div className="flex items-center justify-center py-20 text-slate-500">
                <Loader2 size={28} className="animate-spin mr-3" />
                Loading expenses…
              </div>
            )}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                <WifiOff size={36} className="text-red-400/60" />
                <p className="text-red-400">{error}</p>
                <button
                  onClick={loadExpenses}
                  className="text-sm text-violet-400 hover:text-violet-300 underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            )}
            {!loading && !error && expenses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 gap-3">
                <ReceiptText size={48} strokeWidth={1} />
                <p className="text-slate-500">No expenses yet. Add your first one!</p>
              </div>
            )}
            {!loading && !error && expenses.length > 0 && (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
