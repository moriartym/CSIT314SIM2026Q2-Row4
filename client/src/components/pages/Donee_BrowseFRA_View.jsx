import { useState, useEffect } from 'react'

const API     = 'http://localhost:3001/api/fra'
const DON_API = 'http://localhost:3001/api/fra/donations'
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

function StatusBadge({ status }) {
  const cls = { active: 'ua-badge-active', suspended: 'ua-badge-inactive', completed: 'ua-badge-completed' }
  return <span className={`ua-badge ${cls[status] || ''}`}>{status}</span>
}

function DonateModal({ fra, onClose, onSuccess }) {
  const [amount, setAmount]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) { setError('Enter a valid amount'); return }
    setLoading(true); setError(null)
    try {
      const res  = await fetch(DON_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ fraId: fra._id, amount: Number(amount) }) })
      const data = await res.json()
      if (data.success) onSuccess(Number(amount))
      else setError(data.message)
    } catch { setError('Error connecting to server') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={onClose}>
      <div style={{ background: 'var(--ua-bg)', border: '1px solid var(--ua-border)', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '360px' }} onClick={e => e.stopPropagation()}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 600, color: 'var(--ua-text)', marginBottom: '4px' }}>Donate to campaign</p>
        <p className="ua-row-desc" style={{ marginBottom: '20px' }}>{fra.title}</p>
        <div className="ua-field">
          <label className="ua-label">Amount (SGD)</label>
          <input className="ua-input" type="number" placeholder="e.g. 50" value={amount} onChange={e => { setAmount(e.target.value); setError(null) }} autoFocus />
        </div>
        {error && <div className="ua-msg ua-msg-error" style={{ marginBottom: '12px' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ua-btn" style={{ flex: 1 }} onClick={handleDonate} disabled={loading}>{loading ? 'Processing…' : 'Confirm Donation'}</button>
          <button className="ua-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function Donee_BrowseFRA_View({ fraId, onBack }) {
  const [fra, setFra]           = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [isSaved, setIsSaved]   = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)
  const [totalRaised, setTotalRaised] = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [fraRes, viewRes] = await Promise.all([
          fetch(`${API}/${fraId}`, { credentials: 'include' }),
          fetch(`${API}/${fraId}/view`, { method: 'POST', credentials: 'include' }),
        ])
        const fraData = await fraRes.json()
        await viewRes.json()
        if (fraData.success) { setFra(fraData.data); setTotalRaised(fraData.data.totalRaised ?? 0) }
        else setError(fraData.message)
      } catch { setError('Error connecting to server') }
      finally { setLoading(false) }
    }
    const checkFav = async () => {
      try {
        const res  = await fetch(`${FAV_API}/search?query=`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) setIsSaved(data.data.some(f => (f.fra?._id || f.fra) === fraId))
      } catch {}
    }
    load()
    checkFav()
  }, [fraId])

  const toggleFav = async () => {
    setFavLoading(true)
    try {
      const res  = await fetch(`${FAV_API}/${fraId}`, { method: isSaved ? 'DELETE' : 'POST', credentials: 'include' })
      const data = await res.json()
      if (data.success) setIsSaved(prev => !prev)
    } catch {}
    finally { setFavLoading(false) }
  }

  if (loading) return <div className="ua-card"><p className="ua-muted">Loading…</p></div>
  if (error)   return <div className="ua-card"><div className="ua-msg ua-msg-error">{error}</div></div>
  if (!fra)    return null

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Campaign Details</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={onBack}>← Back</button>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          <div className="ua-avatar" style={{ width: 42, height: 42, fontSize: 14 }}>{fra.title.slice(0, 2).toUpperCase()}</div>
          <div>
            <p className="ua-row-name" style={{ fontSize: '1rem' }}>{fra.title}</p>
            <StatusBadge status={fra.status} />
          </div>
        </div>
      </div>

      <div className="ua-divider" />

      <ReadField label="Title"         value={fra.title} />
      <ReadField label="Description"   value={fra.description} />
      <ReadField label="Target Amount" value={fra.targetAmount != null ? `$${fra.targetAmount.toLocaleString()}` : ''} />
      <ReadField label="Category"      value={fra.category?.name} />
      <ReadField label="Created"       value={fra.createdAt ? new Date(fra.createdAt).toLocaleDateString() : ''} />

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

      <ProgressBar totalRaised={totalRaised} targetAmount={fra.targetAmount ?? 0} />

      {fra.status === 'active' && (
        <div className="ua-row-actions" style={{ marginTop: '1rem' }}>
          <button className="ua-btn ua-btn-sm" onClick={() => setDonateOpen(true)}>💳 Donate</button>
          <button
            className="ua-btn-ghost"
            style={{ color: isSaved ? '#e53e3e' : 'inherit', opacity: favLoading ? 0.5 : 1 }}
            onClick={toggleFav}
            disabled={favLoading}
          >
            {favLoading ? '…' : isSaved ? '♥ Saved' : '♡ Save'}
          </button>
        </div>
      )}

      {donateOpen && (
        <DonateModal
          fra={fra}
          onClose={() => setDonateOpen(false)}
          onSuccess={(amount) => { setTotalRaised(prev => prev + amount); setDonateOpen(false) }}
        />
      )}
    </div>
  )
}
