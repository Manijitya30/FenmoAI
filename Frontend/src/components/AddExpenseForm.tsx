import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { createExpense } from '../api';
import type { CreateExpensePayload, Expense } from '../types';
const CATEGORIES = [
  'Food',
  'Travel',
  'Bills',
  'Shopping',
  'Health',
  'Entertainment',
  'Education',
  'Other',
];
interface Props {
  onCreated: (expense: Expense) => void;
}
export default function AddExpenseForm({ onCreated }: Props) {
  const [form, setForm] = useState({
    amount: '' as string | number,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0], 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsedAmount = typeof form.amount === 'string' ? parseFloat(form.amount) : form.amount;
    if (!form.category) { setError('Please select a category.'); return; }
    if (isNaN(parsedAmount) || parsedAmount <= 0) { setError('Amount must be a valid number greater than 0.'); return; }
    if (!form.date) { setError('Please select a date.'); return; }
    setLoading(true);
    try {
      const payload: CreateExpensePayload = {
        amount: parsedAmount,
        category: form.category,
        description: form.description,
        date: form.date,
      };
      const expense = await createExpense(payload);
      onCreated(expense);
      setSuccess(true);
      setForm({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
        <PlusCircle className="text-violet-400" size={22} />
        Add Expense
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Amount (₹)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount || ''}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-[#1e1e2e] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              required
            >
              <option value="" className="bg-[#1e1e2e]">Select…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#1e1e2e]">{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            rows={2}
            placeholder="What was this for?"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2">
            ✓ Expense added successfully!
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <PlusCircle size={18} />
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
}
