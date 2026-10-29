import { useState } from 'react'

function getInitialValues(fields, record) {
  if (record) {
    const values = { ...record }
    for (const field of fields) {
      if (field.kind === 'date' && values[field.key]) values[field.key] = values[field.key].slice(0, 10)
    }
    return values
  }

  const values = {}
  const localToday = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  for (const field of fields) {
    if (field.kind === 'date') values[field.key] = localToday
  }
  return values
}

export default function RecordFormModal({ resource, record, relations, saving, error, onSave, onClose }) {
  const [values, setValues] = useState(() => getInitialValues(resource.fields, record))

  function updateField(key, value) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function submitForm(event) {
    event.preventDefault()
    onSave(values)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="record-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{record ? 'UPDATE RECORD' : 'ADD TO YOUR COLLECTION'}</p>
            <h2 id="form-title">{record ? 'Edit' : 'New'} {resource.singular}</h2>
          </div>
          <button className="close-button" aria-label="Close form" onClick={onClose}>×</button>
        </div>
        {error && <div className="error-banner" role="alert">{error}</div>}
        <form onSubmit={submitForm}>
          <div className="form-fields">
            {resource.fields.map((field) => (
              <label key={field.key} className={field.kind === 'textarea' ? 'form-field wide' : 'form-field'}>
                <span>{field.label}{field.required && <b> *</b>}</span>
                {field.kind === 'select' ? (
                  <select
                    required={field.required}
                    value={values[field.key] ?? ''}
                    onChange={(event) => updateField(field.key, event.target.value)}
                  >
                    <option value="">Choose {field.label.toLowerCase()}</option>
                    {(relations[field.source] ?? []).map((option) => (
                      <option key={option.id} value={option.id}>{option.fullName ?? option.name ?? option.title}</option>
                    ))}
                  </select>
                ) : field.kind === 'textarea' ? (
                  <textarea
                    rows="3"
                    value={values[field.key] ?? ''}
                    onChange={(event) => updateField(field.key, event.target.value)}
                  />
                ) : (
                  <input
                    type={field.kind ?? 'text'}
                    min={field.min}
                    step={field.step}
                    required={field.required}
                    value={values[field.key] ?? ''}
                    onChange={(event) => updateField(field.key, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving...' : 'Save record'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}