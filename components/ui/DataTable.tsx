'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onSearchChange?: (term: string) => void;
  filterComponent?: React.ReactNode;
  emptyMessage?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  onSearchChange,
  filterComponent,
  emptyMessage = 'No matching records found.',
  pageSize = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setPage(0);
    if (onSearchChange) onSearchChange(val);
  };

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-soft overflow-hidden">
      {/* Search & Filters Bar */}
      {(onSearchChange || filterComponent) && (
        <div className="p-4 border-b border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/40">
          {onSearchChange && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-border rounded-full text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:bg-white focus:border-sage transition-all"
              />
            </div>
          )}
          {filterComponent && <div className="w-full sm:w-auto flex items-center gap-2">{filterComponent}</div>}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 border-b border-border/70 text-[11px] uppercase tracking-wider text-foreground-secondary font-bold">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-3.5 font-bold ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-foreground">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-foreground-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick ? 'hover:bg-surface-elevated cursor-pointer' : 'hover:bg-surface-elevated/40'
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`px-4 py-3.5 ${col.className || ''}`}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-border/70 flex items-center justify-between text-xs text-foreground-secondary">
          <div>
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, data.length)} of{' '}
            {data.length} records
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded border border-border hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded border border-border hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
