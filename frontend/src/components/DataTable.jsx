import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function DataTable({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Pesquisar...",
  searchField,
  emptyMessage = "Nenhum registro encontrado.",
  actions,
}) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    if (!search || !searchField) return data;
    return data.filter((row) => {
      const val = String(row[searchField] ?? "").toLowerCase();
      return val.includes(search.toLowerCase());
    });
  }, [data, search, searchField]);

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortField] ?? "");
      const bVal = String(b[sortField] ?? "");
      const cmp = aVal.localeCompare(bVal, "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  function handleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div className="space-y-4">
      {/* Search + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {searchable && (
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full sm:w-64 px-3 py-2 rounded-lg border border-[#d1d5db] bg-white text-sm text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]"
          />
        )}
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
        <table className="w-full text-sm animate-fade-in-up">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider",
                    col.sortable && "cursor-pointer select-none hover:text-[#374151] transition-colors"
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortField === col.key && (
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {sortDir === "asc" ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        )}
                      </svg>
                    )}
                  </span>
                </th>
              ))}
              {columns.some((c) => c.key === "actions") || (
                <th className="px-5 py-3.5 w-20" />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 stagger-rows">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-12 text-center text-sm text-[#9ca3af]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={row.id || i}
                  className="hover:bg-zinc-800/30 transition-all duration-150 hover:scale-[1.002]"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5 text-[#374151]">
                      {col.render ? col.render(row) : row[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#6b7280]">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-[#d1d5db] disabled:opacity-40 hover:bg-[#f3f4f6]"
            >
              Anterior
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded border border-[#d1d5db] disabled:opacity-40 hover:bg-[#f3f4f6]"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}