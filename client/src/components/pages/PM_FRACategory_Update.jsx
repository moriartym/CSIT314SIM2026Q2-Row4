import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api/fra-categories'

function Field({ label, error, children }) {
  return (
    <div className="ua-field">
      <label className="ua-label">{label}</label>
      {children}
      {error && <p className="ua-err-text">{error}</p>}
    </div>
  )
}

export default function PM_FRACategory_Update({ categoryId, onNavigate }) {
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState({ name: '', description: '' })
  const [errors, setErrors]     = useState({})
  const [message, setMessage]   = useState(null)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (categoryId) loadCategory(categoryId)
  }, [categoryId])

  const loadCategory = async (id) => {
    setLoadError(null)
    try {
      const res  = await fetch(`${API}/${id}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setSelected(data.data)
        setForm({ name: data.data.name || '', description: data.data.description || '' })
      } else {
        setLoadError(data.message)
      }
    } catch { setLoadError('Error connecting to server') }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: null }))
    setMessage(null)
  }

  const handleSubmit = async () => {
    if (!selected) return

    const body = {}
    if (form.name.trim())        body.name        = form.name.trim()
    if (form.description.trim()) body.description = form.description.trim()

    if (!Object.keys(body).length) { setMessage({ type: 'error', text: 'No changes to save' }); return }

    try {
      const res  = await fetch(`${API}/${selected._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Category updated successfully!' })
        loadCategory(selected._id)
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error connecting to server' })
    }
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Update Category</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
      </div>

      {!selected && !loadError && (
        <p className="ua-muted">Loading category details…</p>
      )}

      {loadError && (
        <div className="ua-msg ua-msg-error">{loadError}</div>
      )}

      {selected && (
        <>
          <div style={{ marginBottom: '0.75rem' }}>
            <p className="ua-muted" style={{ fontSize: '0.72rem' }}>ID: {selected._id}</p>
          </div>
          <div className="ua-divider" />
          <p className="ua-hint">Edit the fields you want to change</p>

          <Field label="Name" error={errors.name}>
            <input className={`ua-input ${errors.name ? 'ua-input-err' : ''}`} name="name" value={form.name} onChange={handleChange} />
          </Field>

          <Field label="Description">
            <textarea className="ua-input" name="description" value={form.description} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
          </Field>

          <button className="ua-btn" onClick={handleSubmit}>Save Changes</button>
          {message && <div className={`ua-msg ${message.type === 'success' ? 'ua-msg-success' : 'ua-msg-error'}`}>{message.text}</div>}
        </>
      )}
    </div>
  )
}
