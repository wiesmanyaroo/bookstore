import { useEffect, useState } from 'react'
import { deleteResourceRecord, loadResourceData, saveResourceRecord } from './api/bookstoreApi'
import RecordFormModal from './components/RecordFormModal'
import RecordsTable from './components/RecordsTable'
import ResourceSidebar from './components/ResourceSidebar'
import { emptyRelations, resources } from './config/resources'
import { formatRecordValue } from './utils/formatRecordValue'
import './App.css'

function App() {
  const [activeResource, setActiveResource] = useState('books')
  const [rows, setRows] = useState([])
  const [relations, setRelations] = useState(emptyRelations)
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const resource = resources[activeResource]
  const editingRecord = rows.find((row) => row.id === editingId) ?? null

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const data = await loadResourceData(activeResource)
        if (active) {
          setRows(data.rows)
          setRelations(data.relations)
          setError('')
        }
      } catch (loadError) {
        if (active) setError(loadError.message || 'Could not connect to the API.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => { active = false }
  }, [activeResource])

  async function refreshData() {
    setLoading(true)
    try {
      const data = await loadResourceData(activeResource)
      setRows(data.rows)
      setRelations(data.relations)
      setError('')
    } catch (loadError) {
      setError(loadError.message || 'Could not load bookstore data.')
    } finally {
      setLoading(false)
    }
  }

  function selectResource(resourceKey) {
    if (resourceKey === activeResource) return
    setActiveResource(resourceKey)
    setEditingId(null)
    setFormOpen(false)
    setLoading(true)
    setError('')
  }

  function startCreate() {
    setEditingId(null)
    setError('')
    setFormOpen(true)
  }

  function startEdit(row) {
    setEditingId(row.id)
    setError('')
    setFormOpen(true)
  }

  async function saveRecord(values) {
    setSaving(true)
    setError('')
    try {
      await saveResourceRecord(resource, editingId, values)
      setFormOpen(false)
      setEditingId(null)
      await refreshData()
    } catch (saveError) {
      setError(saveError.message || 'Could not save this record.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteRecord(row) {
    if (!window.confirm(`Delete this ${resource.singular.toLowerCase()}?`)) return
    setError('')
    try {
      await deleteResourceRecord(resource, row.id)
      await refreshData()
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete this record.')
    }
  }

  function closeForm() {
    setFormOpen(false)
    setEditingId(null)
    setError('')
  }

  function getValue(row, key) {
    return formatRecordValue(row, key, relations)
  }

  return (
    <div className="store-shell">
      <ResourceSidebar
        resources={resources}
        activeResource={activeResource}
        recordCount={rows.length}
        onSelect={selectResource}
      />

      <main className="main-panel">
        <header className="topbar">
          <span>INVENTORY / {resource.label.toUpperCase()}</span>
          <span className="topbar-date">PAPER &amp; PINE <span>·</span> EST. 2025</span>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">YOUR BOOKSHOP, IN ORDER</p>
              <h1>{resource.label}<span className="heading-period">.</span></h1>
              <p className="page-description">Manage your {resource.label.toLowerCase()} and keep the shelves in good shape.</p>
            </div>
            <div className="record-total"><strong>{String(rows.length).padStart(2, '0')}</strong><span>RECORDS</span></div>
          </div>

          {error && !formOpen && <div className="error-banner" role="alert">{error}</div>}

          <RecordsTable
            key={activeResource}
            resource={resource}
            rows={rows}
            loading={loading}
            getValue={getValue}
            onCreate={startCreate}
            onEdit={startEdit}
            onDelete={deleteRecord}
          />

          <footer className="page-footer">
            <span>Thoughtful books. Well-kept shelves.</span>
            <span>BOOKSTORE MANAGEMENT · 2025</span>
          </footer>
        </section>
      </main>

      {formOpen && (
        <RecordFormModal
          key={`${activeResource}-${editingId ?? 'new'}`}
          resource={resource}
          record={editingRecord}
          relations={relations}
          saving={saving}
          error={error}
          onSave={saveRecord}
          onClose={closeForm}
        />
      )}
    </div>
  )
}

export default App