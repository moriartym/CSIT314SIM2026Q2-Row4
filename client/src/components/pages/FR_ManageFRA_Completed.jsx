import { useState, useEffect } from 'react'

const API     = 'http://localhost:3001/api/fra'
const CAT_API = 'http://localhost:3001/api/fra-categories'

function StatusBadge({ status }) {
  const cls = { active: 'ua-badge-active', suspended: 'ua-badge-inactive', completed: 'ua-badge-completed' }
  return <span className={`ua-badge ${cls[status] || ''}`}>{status}</span>
}

export default function CompletedFRA({ onNavigate }) {
  const [fras, setFras]             = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [category, setCategory]     = useState('')
  const [from, setFrom]             = useState('')
  const [to, setTo]                 = useState('')

  useEffect(() => {
    fetch(`${CAT_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setCategories((d.data || []).filter(c => c.isActive)) })
      .catch(() => {})
    fetchCompleted()
  }, [])

  const fetchCompleted = async (cat = '', fromDate = '', toDate = '') => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams()
      if (cat)      params.set('category', cat)
      if (fromDate) params.set('from', fromDate)
      if (toDate)   params.set('to', toDate)
      const res  = await fetch(`${API}/completed?${params.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setFras(data.data)
      else setError(data.message)
    } catch { setError('Error connecting to server') }
    finally { setLoading(false) }
  }

  const handleFilter = () => fetchCompleted(category, from, to)
  const handleReset  = () => { setCategory(''); setFrom(''); setTo(''); fetchCompleted() }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Completed campaigns</span>
        <button className="ua-btn ua-btn-sm" onClick={handleReset}>Refresh</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <select className="ua-input" style={{ flex: 1, minWidth: '140px' }} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input className="ua-input" type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ flex: 1, minWidth: '130px' }} />
        <input className="ua-input" type="date" value={to}   onChange={e => setTo(e.target.value)}   style={{ flex: 1, minWidth: '130px' }} />
        <button className="ua-btn ua-btn-sm" onClick={handleFilter}>Filter</button>
      </div>

      {loading && <p className="ua-muted">Loading…</p>}
      {error   && <div className="ua-msg ua-msg-error">{error}</div>}
      {!loading && !error && fras.length === 0 && <p className="ua-muted">No completed campaigns found</p>}

      <div className="ua-list">
        {fras.map(fra => (
          <div key={fra._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
              {fra.title.slice(0, 2).toUpperCase()}
            </div>
            <div className="ua-row-body" style={{ flex: 1, minWidth: 0 }}>
              <p className="ua-row-name">{fra.title}</p>
              <p className="ua-row-desc">
                {fra.category?.name ?? '-'} · ${fra.targetAmount?.toLocaleString()} · Raised: ${fra.totalRaised?.toLocaleString() ?? 0}
              </p>
              <p className="ua-row-desc">
                Completed: {fra.completedAt ? new Date(fra.completedAt).toLocaleDateString() : '-'}
              </p>
            </div>
            <StatusBadge status={fra.status} />
            <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('view', fra._id)}>View</button>
          </div>
        ))}
      </div>
    </div>
  )
}