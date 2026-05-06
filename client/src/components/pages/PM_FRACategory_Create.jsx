import { useState } from 'react'

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

export default function PM_FRACategory_Create({ onNavigate }) {
  const [form, setForm]       = useState({ name: '', description: '' })
  const [errors, setErrors]   = useState({})
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: null }))
    setMessage(null)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setErrors({ name: 'Category name is required' }); return }

    try {
      const res  = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: `Category created! ID: ${data.data._id}` })
        setForm({ name: '', description: '' })
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
        <span className="ua-card-title">New Category</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
      </div>

      <Field label="Name *" error={errors.name}>
        <input className={`ua-input ${errors.name ? 'ua-input-err' : ''}`} name="name" placeholder="Category name" value={form.name} onChange={handleChange} />
      </Field>

      <Field label={<>Description <span className="ua-optional">(optional)</span></>}>
        <textarea className="ua-input" name="description" placeholder="Describe this category..." value={form.description} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
      </Field>

      <button className="ua-btn" onClick={handleSubmit}>Create Category</button>
      {message && <div className={`ua-msg ${message.type === 'success' ? 'ua-msg-success' : 'ua-msg-error'}`}>{message.text}</div>}
    </div>
  )
}
