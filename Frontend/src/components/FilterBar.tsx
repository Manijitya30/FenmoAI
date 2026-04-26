import { Filter, ArrowDownUp } from 'lucide-react';
import type { Filters } from '../types';
const CATEGORIES = [
  'Food', 'Travel', 'Bills', 'Shopping',
  'Health', 'Entertainment', 'Education', 'Other',
];
interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}
export default function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
        <Filter size={15} className="text-slate-400" />
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-[#1e1e2e]">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-[#1e1e2e]">{c}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
        <ArrowDownUp size={15} className="text-slate-400" />
        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(e) =>
            onChange({ ...filters, sort: e.target.value as Filters['sort'] })
          }
          className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="created_desc" className="bg-[#1e1e2e]">Newest added</option>
          <option value="date_desc" className="bg-[#1e1e2e]">Newest date</option>
        </select>
      </div>
    </div>
  );
}
