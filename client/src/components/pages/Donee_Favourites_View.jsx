import { useState, useEffect } from 'react'

const API     = 'http://localhost:3001/api/fra'
const FAV_API = 'http://localhost:3001/api/favourites'

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

export default function Donee_Favourites_View({ fraId, favId, onBack, onRemoved }) {
  const [fra, setFra]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${API}/${fraId}`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) setFra(data.data)
        else setError(data.message)
      } catch { setError('Error connecting to server') }
      finally { setLoading(false) }
    }
    load()
  }, [fraId])

  const handleRemove = async () => {
    setRemoving(true)
    try {
      const res  = await fetch(`${FAV_API}/${fraId}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (data.success) { onRemoved?.(); onBack() }
    } catch {}
    finally { setRemoving(false) }
  }

  if (loading) return <div className="ua-card"><p className="ua-muted">Loading…</p></div>
  if (error)   return <div className="ua-card"><div className="ua-msg ua-msg-error">{error}</div></div>
  if (!fra)    return null

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Saved Campaign</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={onBack}>← Back</button>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="ua-avatar" style={{ width: 42, height: 42, fontSize: 14 }}>{fra.title.slice(0, 2).toUpperCase()}</div>
          <div>
            <p className="ua-row-name" style={{ fontSize: '1rem' }}>{fra.title}</p>
            <span className={`ua-badge ${fra.status === 'active' ? 'ua-badge-active' : 'ua-badge-inactive'}`}>{fra.status}</span>
          </div>
        </div>
      </div>

      <div className="ua-divider" />

      <ReadField label="Title"         value={fra.title} />
      <ReadField label="Description"   value={fra.description} />
      <ReadField label="Target Amount" value={fra.targetAmount != null ? `$${fra.targetAmount.toLocaleString()}` : ''} />
      <ReadField label="Category"      value={fra.category?.name} />
      <ReadField label="Created"       value={fra.createdAt ? new Date(fra.createdAt).toLocaleDateString() : ''} />

      <ProgressBar totalRaised={fra.totalRaised ?? 0} targetAmount={fra.targetAmount ?? 0} />

      <div className="ua-row-actions" style={{ marginTop: '1rem' }}>
        <button
          className="ua-btn-ghost"
          style={{ color: '#e53e3e', opacity: removing ? 0.5 : 1 }}
          onClick={handleRemove}
          disabled={removing}
        >
          {removing ? '…' : '♥ Remove from favourites'}
        </button>
      </div>
    </div>
  )
}
