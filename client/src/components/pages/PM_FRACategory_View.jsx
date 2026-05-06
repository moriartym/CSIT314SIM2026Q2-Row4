import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api/fra-categories'

function ReadField({ label, value }) {
  return (
    <div className="ua-field">
      <label className="ua-label">{label}</label>
      <input className="ua-input" value={value || '-'} disabled style={{ opacity: 0.75, cursor: 'default' }} readOnly />
    </div>
  )
}

export default function PM_FRACategory_View({ categoryId, onNavigate }) {
  const [category, setCategory] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${API}/${categoryId}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setCategory(data.data)
      else setError(data.message)
    } catch { setError('Error connecting to server') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [categoryId])

  const suspend = async () => {
    try {
      await fetch(`${API}/${categoryId}/suspend`, { method: 'PATCH', credentials: 'include' })
      load()
    } catch {}
  }

  if (loading) return <div className="ua-card"><p className="ua-muted">Loading…</p></div>
  if (error)   return <div className="ua-card"><div className="ua-msg ua-msg-error">{error}</div></div>
  if (!category) return null

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Category Details</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
          <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('update', categoryId)}>Update</button>
        </div>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <p className="ua-muted" style={{ fontSize: '0.72rem' }}>Category ID: {category._id}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          <div className="ua-avatar" style={{ width: 42, height: 42, fontSize: 14 }}>
            {category.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="ua-row-name" style={{ fontSize: '1rem' }}>{category.name}</p>
            <span className={`ua-badge ${category.isActive ? 'ua-badge-active' : 'ua-badge-inactive'}`}>
              {category.isActive ? 'Active' : 'Suspended'}
            </span>
          </div>
        </div>
      </div>

      <div className="ua-divider" />

      <ReadField label="Name"        value={category.name} />
      <ReadField label="Description" value={category.description} />
      <ReadField label="Created"     value={category.createdAt ? new Date(category.createdAt).toLocaleDateString() : ''} />

      <div className="ua-row-actions" style={{ marginTop: '1rem' }}>
        <button className="ua-btn-ghost" onClick={suspend}>
          {category.isActive ? 'Suspend Category' : 'Activate Category'}
        </button>
      </div>
    </div>
  )
}
