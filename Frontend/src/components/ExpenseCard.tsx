import { ShoppingCart, Plane, Zap, Package, Heart, Film, BookOpen, MoreHorizontal } from 'lucide-react';
import type { Expense } from '../types';
const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ElementType; bg: string; text: string; dot: string }
> = {
  Food:          { icon: ShoppingCart,  bg: 'bg-orange-500/15', text: 'text-orange-400',  dot: 'bg-orange-400' },
  Travel:        { icon: Plane,         bg: 'bg-sky-500/15',    text: 'text-sky-400',     dot: 'bg-sky-400' },
  Bills:         { icon: Zap,           bg: 'bg-yellow-500/15', text: 'text-yellow-400',  dot: 'bg-yellow-400' },
  Shopping:      { icon: Package,       bg: 'bg-pink-500/15',   text: 'text-pink-400',    dot: 'bg-pink-400' },
  Health:        { icon: Heart,         bg: 'bg-red-500/15',    text: 'text-red-400',     dot: 'bg-red-400' },
  Entertainment: { icon: Film,          bg: 'bg-purple-500/15', text: 'text-purple-400',  dot: 'bg-purple-400' },
  Education:     { icon: BookOpen,      bg: 'bg-teal-500/15',   text: 'text-teal-400',    dot: 'bg-teal-400' },
  Other:         { icon: MoreHorizontal,bg: 'bg-slate-500/15',  text: 'text-slate-400',   dot: 'bg-slate-400' },
};
const fallback = CATEGORY_CONFIG['Other'];
function getCategoryConfig(category: string) {
  return CATEGORY_CONFIG[category] ?? { ...fallback };
}
function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}
function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
interface Props {
  expense: Expense;
}
export default function ExpenseCard({ expense }: Props) {
  const cfg = getCategoryConfig(expense.category);
  const Icon = cfg.icon;
  return (
    <div className="group flex items-center gap-4 bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl px-5 py-4 transition-all duration-200 cursor-default">
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${cfg.bg}`}>
        <Icon size={20} className={cfg.text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
            {expense.category}
          </span>
        </div>
        <p className="text-slate-300 text-sm truncate">
          {expense.description || <span className="italic text-slate-500">No description</span>}
        </p>
        <p className="text-slate-500 text-xs mt-0.5">{formatDate(expense.date)}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-white font-semibold text-lg leading-none">
          {formatAmount(expense.amount)}
        </p>
      </div>
    </div>
  );
}
