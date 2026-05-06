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

export default function FR_ManageFRA_Create({ onNavigate }) {
  const [categories, setCategories] = useState([])
  const [form, setForm]             = useState({ title: '', description: '', targetAmount: '', category: '' })
  const [errors, setErrors]         = useState({})
  const [message, setMessage]       = useState(null)

  useEffect(() => {
    fetch(`${CAT_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setCategories((d.data || []).filter(c => c.isActive)) })
      .catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: null }))
    setMessage(null)
  }

  const handleSubmit = async () => {
    const errs = {}
    if (!form.title.trim())             errs.title        = 'Title is required'
    if (!form.targetAmount)             errs.targetAmount = 'Target amount is required'
    if (Number(form.targetAmount) <= 0) errs.targetAmount = 'Target amount must be greater than 0'
    if (Object.keys(errs).length) { setErrors(errs); return }

    const body = { title: form.title.trim(), description: form.description.trim(), targetAmount: Number(form.targetAmount) }
    if (form.category) body.category = form.category

    try {
      const res  = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: `Campaign created! ID: ${data.data._id}` })
        setForm({ title: '', description: '', targetAmount: '', category: '' })
        setErrors({})
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
        <span className="ua-card-title">New Campaign</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
      </div>

      <Field label="Title *" error={errors.title}>
        <input className={`ua-input ${errors.title ? 'ua-input-err' : ''}`} name="title" placeholder="Campaign title" value={form.title} onChange={handleChange} />
      </Field>

      <Field label="Description">
        <textarea className="ua-input" name="description" placeholder="Describe your campaign..." value={form.description} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
      </Field>

      <Field label="Target Amount (SGD) *" error={errors.targetAmount}>
        <input className={`ua-input ${errors.targetAmount ? 'ua-input-err' : ''}`} name="targetAmount" type="number" placeholder="e.g. 10000" value={form.targetAmount} onChange={handleChange} />
      </Field>

      <Field label={<>Category <span className="ua-optional">(optional)</span></>}>
        <select className="ua-input" name="category" value={form.category} onChange={handleChange}>
          <option value="">Select category (optional)</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </Field>

      <button className="ua-btn" onClick={handleSubmit}>Create Campaign</button>
      {message && <div className={`ua-msg ${message.type === 'success' ? 'ua-msg-success' : 'ua-msg-error'}`}>{message.text}</div>}
    </div>
  )
}
