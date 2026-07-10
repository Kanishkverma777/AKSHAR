import { useState, useMemo } from 'react';
import { Search, Plus, ChevronUp, ChevronDown, Pencil, Trash2, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

const PAGE_SIZE = 10;

/**
 * Generic data table with search, sort, pagination, and row actions.
 *
 * @param {Object} props
 * @param {string} props.title — table title
 * @param {Array} props.columns — [{ key, label, render?, sortable? }]
 * @param {Array} props.data — row data
 * @param {boolean} props.loading
 * @param {Function} props.onAdd — callback for create button
 * @param {Function} props.onEdit — (row) => void
 * @param {Function} props.onDelete — (row) => void
 * @param {string} props.addLabel — label for the add button
 * @param {React.ReactNode} props.filters — optional filter bar content
 */
export default function DataTable({
  title,
  columns,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  addLabel = 'Add New',
  filters,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 250);

  // Filter
  const filtered = useMemo(() => {
    if (!debouncedSearch) return data;
    const q = debouncedSearch.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = col.render ? '' : String(row[col.key] ?? '');
        return val.toLowerCase().includes(q);
      })
    );
  }, [data, debouncedSearch, columns]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Reset page when search changes
  useMemo(() => setPage(1), [debouncedSearch]);

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-header-left">
          <span className="table-title">{title}</span>
          <span className="table-count">{filtered.length} records</span>
        </div>
        <div className="table-header-right">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              className="search-input"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {onAdd && (
            <button className="btn btn-primary" onClick={onAdd}>
              <Plus size={16} />
              {addLabel}
            </button>
          )}
        </div>
      </div>

      {filters && <div className="filter-bar">{filters}</div>}

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : paginated.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Inbox size={28} /></div>
          <div className="empty-state-title">No records found</div>
          <div className="empty-state-text">
            {search ? 'Try adjusting your search' : 'Get started by adding a new record'}
          </div>
          {onAdd && !search && (
            <button className="btn btn-primary" onClick={onAdd}>
              <Plus size={16} /> {addLabel}
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={sortKey === col.key ? 'sorted' : ''}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                    >
                      {col.label}
                      {sortKey === col.key && (
                        <span className="sort-icon">
                          {sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </span>
                      )}
                    </th>
                  ))}
                  {(onEdit || onDelete) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row) : (row[col.key] ?? '—')}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td>
                        <div className="td-actions">
                          {onEdit && (
                            <button className="btn-icon edit" onClick={() => onEdit(row)} title="Edit">
                              <Pencil size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button className="btn-icon delete" onClick={() => onDelete(row)} title="Delete">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
              </div>
              <div className="pagination-controls">
                <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                  Math.max(0, page - 3), Math.min(totalPages, page + 2)
                ).map((p) => (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
