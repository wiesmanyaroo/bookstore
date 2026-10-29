import { useState } from 'react'

export default function RecordsTable({ resource, rows, loading, getValue, onCreate, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const filteredRows = rows.filter((row) =>
    resource.columns.some((key) => String(getValue(row, key)).toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <>
      <div className="toolbar">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${resource.label.toLowerCase()}...`}
          />
        </label>
        <button className="primary-button" onClick={onCreate}>＋ <span>New {resource.singular}</span></button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {resource.columns.map((key) => (
                <th key={key}>
                  {resource.fields.find((field) => field.key === key)?.label ?? (key === 'orders' ? 'Orders' : key)}
                </th>
              ))}
              <th className="actions-heading">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="empty-state" colSpan={resource.columns.length + 1}>Loading your collection...</td></tr>
            ) : filteredRows.length ? filteredRows.map((row) => (
              <tr key={row.id}>
                {resource.columns.map((key) => (
                  <td key={key} className={key === 'title' || key === 'fullName' || key === 'name' ? 'primary-cell' : ''}>
                    {getValue(row, key)}
                  </td>
                ))}
                <td className="row-actions">
                  <button className="text-action" onClick={() => onEdit(row)}>Edit</button>
                  <button className="text-action delete-action" onClick={() => onDelete(row)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="empty-state" colSpan={resource.columns.length + 1}>
                  {search ? 'No matching records.' : 'No records yet. Add one to get started.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-foot">
        <span>SHOWING {filteredRows.length} OF {rows.length} {resource.label.toUpperCase()}</span>
        <span>ALL CHANGES SAVE TO SQLITE</span>
      </div>
    </>
  )
}