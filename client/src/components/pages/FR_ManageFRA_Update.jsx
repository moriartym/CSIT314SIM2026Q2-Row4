import { useState, useEffect } from 'react'

const API     = 'http://localhost:3001/api/fra'
const CAT_API = 'http://localhost:3001/api/fra-categories'

function Field({ label, error, children }) {
  return (
    <div className="ua-field">
      <label className="ua-label">{label}</label>
      {children}
      {error && <p className="ua-err-text">{error}</p>}
    </div>
  )
}

export default function FR_ManageFRA_Update({ fraId, onNavigate }) {
  const [categories, setCategories] = useState([])
  const [selected, setSelected]     = useState(null)
  const [form, setForm]             = useState({ title: '', description: '', targetAmount: '', category: '' })
  const [errors, setErrors]         = useState({})
  const [message, setMessage]       = useState(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    fetch(`${CAT_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setCategories((d.data || []).filter(c => c.isActive)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (fraId) loadFRA(fraId)
  }, [fraId])

  const loadFRA = async (id) => {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/${id}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        const f = data.data
        setSelected(f)
        setForm({
          title:        f.title        || '',
          description:  f.description  || '',
          targetAmount: f.targetAmount?.toString() || '',
          category:     f.category?._id || '',
        })
      }
    } catch {}
    finally { setLoading(false) }
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
    if (form.title.trim())       body.title        = form.title.trim()
    if (form.description.trim()) body.description  = form.description.trim()
    if (form.targetAmount)       body.targetAmount = Number(form.targetAmount)
    if (form.category)           body.category     = form.category

    if (!Object.keys(body).length) { setMessage({ type: 'error', text: 'No changes to save' }); return }
    if (body.targetAmount !== undefined && body.targetAmount <= 0) { setErrors({ targetAmount: 'Must be greater than 0' }); return }

    try {
      const res  = await fetch(`${API}/${selected._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Campaign updated successfully!' })
        loadFRA(selected._id)
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
        <span className="ua-card-title">Update Campaign</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
      </div>

      {loading && <p className="ua-muted">Loading…</p>}

      {!loading && selected && (
        <>
          <p className="ua-muted" style={{ fontSize: '0.72rem', marginBottom: '0.75rem' }}>ID: {selected._id}</p>
          <div className="ua-divider" />
          <p className="ua-hint">Edit the fields you want to change</p>

          <Field label="Title">
            <input className="ua-input" name="title" value={form.title} onChange={handleChange} />
          </Field>

          <Field label="Description">
            <textarea className="ua-input" name="description" value={form.description} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
          </Field>

          <Field label="Target Amount (SGD)" error={errors.targetAmount}>
            <input className={`ua-input ${errors.targetAmount ? 'ua-input-err' : ''}`} name="targetAmount" type="number" value={form.targetAmount} onChange={handleChange} />
          </Field>

          <Field label="Category">
            <select className="ua-input" name="category" value={form.category} onChange={handleChange}>
              <option value="">- keep existing -</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>

          <button className="ua-btn" onClick={handleSubmit}>Save Changes</button>
          {message && <div className={`ua-msg ${message.type === 'success' ? 'ua-msg-success' : 'ua-msg-error'}`}>{message.text}</div>}
        </>
      )}
    </div>
  )
}
