import { TrendingUp, Wallet, Calendar } from 'lucide-react';
import type { Expense } from '../types';
function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
interface Props {
  expenses: Expense[];
}
export default function SummaryBar({ expenses }: Props) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const uniqueCategories = new Set(expenses.map((e) => e.category)).size;
  const stats = [
    {
      label: 'Total Spent',
      value: formatAmount(total),
      icon: Wallet,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Transactions',
      value: expenses.length.toString(),
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Categories',
      value: uniqueCategories.toString(),
      icon: Calendar,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
              <Icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
