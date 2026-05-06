import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api/fra'

function ReadField({ label, value }) {
  return (
    <div className="ua-field">
      <label className="ua-label">{label}</label>
      <input className="ua-input" value={value ?? '-'} disabled style={{ opacity: 0.75, cursor: 'default' }} readOnly />
    </div>
  )
}

function ProgressBar({ totalRaised = 0, targetAmount = 0 }) {
  const pct = targetAmount > 0 ? Math.min(100, (totalRaised / targetAmount) * 100) : 0
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
        <span style={{ color: 'var(--ua-muted)' }}>Raised</span>
        <span style={{ color: 'var(--ua-accent)', fontWeight: 600 }}>
          ${totalRaised.toLocaleString()} / ${targetAmount.toLocaleString()}
        </span>
      </div>
      <div style={{ background: 'var(--ua-border)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: '999px', background: 'var(--ua-accent)', width: `${pct}%`, transition: 'width 0.4s ease' }} />
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--ua-muted)', marginTop: '3px' }}>{pct.toFixed(1)}% funded</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const cls = { active: 'ua-badge-active', suspended: 'ua-badge-inactive', completed: 'ua-badge-completed' }
  return <span className={`ua-badge ${cls[status] || ''}`}>{status}</span>
}

export default function FR_ManageFRA_View({ fraId, onNavigate }) {
  const [fra, setFra]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${API}/${fraId}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setFra(data.data)
      else setError(data.message)
    } catch { setError('Error connecting to server') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [fraId])

  const suspend = async () => {
    try {
      await fetch(`${API}/${fraId}/suspend`, { method: 'PATCH', credentials: 'include' })
      load()
    } catch {}
  }

  const complete = async () => {
    try {
      await fetch(`${API}/${fraId}/complete`, { method: 'PATCH', credentials: 'include' })
      load()
    } catch {}
  }

  if (loading) return <div className="ua-card"><p className="ua-muted">Loading…</p></div>
  if (error)   return <div className="ua-card"><div className="ua-msg ua-msg-error">{error}</div></div>
  if (!fra)    return null

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Campaign Details</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
          {fra.status !== 'completed' && (
            <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('update', fraId)}>Update</button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <p className="ua-muted" style={{ fontSize: '0.72rem' }}>Campaign ID: {fra._id}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          <div className="ua-avatar" style={{ width: 42, height: 42, fontSize: 14 }}>
            {fra.title.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="ua-row-name" style={{ fontSize: '1rem' }}>{fra.title}</p>
            <StatusBadge status={fra.status} />
          </div>
        </div>
      </div>

      <div className="ua-divider" />

      <ReadField label="Title"          value={fra.title} />
      <ReadField label="Description"    value={fra.description} />
      <ReadField label="Target Amount"  value={fra.targetAmount != null ? `$${fra.targetAmount.toLocaleString()}` : ''} />
      <ReadField label="Category"       value={fra.category?.name} />
      <ReadField label="Created"        value={fra.createdAt ? new Date(fra.createdAt).toLocaleDateString() : ''} />
      {fra.completedAt && <ReadField label="Completed" value={new Date(fra.completedAt).toLocaleDateString()} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '0.5rem' }}>
        <div style={{ padding: '10px', background: 'var(--ua-bg)', borderRadius: '6px', border: '1px solid var(--ua-border)' }}>
          <p className="ua-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>VIEWS</p>
          <p style={{ color: 'var(--ua-text)', fontWeight: 600 }}>👁 {fra.viewCount ?? 0}</p>
        </div>
        <div style={{ padding: '10px', background: 'var(--ua-bg)', borderRadius: '6px', border: '1px solid var(--ua-border)' }}>
          <p className="ua-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>SHORTLISTS</p>
          <p style={{ color: 'var(--ua-text)', fontWeight: 600 }}>🔖 {fra.shortlistCount ?? 0}</p>
        </div>
      </div>

      <ProgressBar totalRaised={fra.totalRaised ?? 0} targetAmount={fra.targetAmount ?? 0} />

      <div className="ua-row-actions" style={{ marginTop: '1rem' }}>
        {fra.status !== 'completed' && (
          <button className="ua-btn-ghost" onClick={suspend}>
            {fra.status === 'active' ? 'Suspend Campaign' : 'Activate Campaign'}
          </button>
        )}
        {fra.status === 'active' && (
          <button className="ua-btn-ghost" style={{ color: '#64a0ff', borderColor: '#64a0ff' }} onClick={complete}>
            Mark Complete
          </button>
        )}
      </div>
    </div>
  )
}
