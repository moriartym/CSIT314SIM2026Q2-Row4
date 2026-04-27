import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api/fra'

function StatusBadge({ status }) {
  const map = {
    active:    'ua-badge-active',
    suspended: 'ua-badge-inactive',
    completed: 'ua-badge-completed',
  }
  return <span className={`ua-badge ${map[status] || ''}`}>{status}</span>
}

export default function AllCampaigns() {
  const [fras, setFras]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [expandedId, setExpanded] = useState(null)
  const [search, setSearch]       = useState('')
  const [message, setMessage]     = useState({})

  const fetchAll = async () => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${API}/all`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setFras(data.data)
      else setError(data.message)
    } catch {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearch(query)
    if (!query.trim()) { fetchAll(); return }
    try {
      const res  = await fetch(`${API}/all/search?query=${encodeURIComponent(query)}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setFras(data.data)
      else setFras([])
    } catch { /* ignore */ }
  }

  const handleExpand = async (fra) => {
    const opening = expandedId !== fra._id
    setExpanded(opening ? fra._id : null)
    if (opening) {
      try {
        await fetch(`${API}/${fra._id}/view`, { method: 'POST', credentials: 'include' })
        setFras(prev => prev.map(f => f._id === fra._id ? { ...f, viewCount: f.viewCount + 1 } : f))
      } catch { /* ignore */ }
    }
  }

  const favourite = async (fraId) => {
    try {
      const res  = await fetch(`${API}/${fraId}/shortlist`, { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setMessage(prev => ({ ...prev, [fraId]: 'Saved to favourites!' }))
        setFras(prev => prev.map(f => f._id === fraId ? { ...f, shortlistCount: f.shortlistCount + 1 } : f))
        setTimeout(() => setMessage(prev => ({ ...prev, [fraId]: null })), 2000)
      } else {
        setMessage(prev => ({ ...prev, [fraId]: data.message }))
      }
    } catch {
      setMessage(prev => ({ ...prev, [fraId]: 'Error connecting to server' }))
    }
  }

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">Browse Campaigns</h2>
        <p className="ua-subtitle">Discover and save your favourite fundraising campaigns</p>
      </div>

      <div className="ua-card">
        <div className="ua-card-header">
          <span className="ua-card-title">All campaigns</span>
          <button className="ua-btn ua-btn-sm" onClick={fetchAll}>Refresh</button>
        </div>

        <div className="ua-field">
          <input
            className="ua-input"
            placeholder="Search campaigns..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {loading && <p className="ua-muted">Loading…</p>}
        {error   && <div className="ua-msg ua-msg-error">{error}</div>}
        {!loading && !error && fras.length === 0 && <p className="ua-muted">No campaigns found</p>}

        <div className="ua-list">
          {fras.map(fra => {
            const isExpanded = expandedId === fra._id
            return (
              <div key={fra._id} className="ua-row ua-row-expandable">
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                  onClick={() => handleExpand(fra)}
                >
                  <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                    {fra.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="ua-row-body">
                    <p className="ua-row-name">{fra.title}</p>
                    <p className="ua-row-desc">{fra.category || '—'} · ${fra.targetAmount?.toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusBadge status={fra.status} />
                    {fra.status === 'active' && (
                      <button
                        className="ua-btn-ghost"
                        style={{ padding: '2px 8px', fontSize: '14px' }}
                        onClick={(e) => { e.stopPropagation(); favourite(fra._id) }}
                      >
                        ♡
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--ua-border-2)', marginTop: '0.5rem' }}>
                    <p className="ua-muted" style={{ fontSize: '0.72rem', marginBottom: '0.25rem' }}>ID: {fra._id}</p>
                    <p className="ua-row-name">{fra.title}</p>
                    {fra.description && <p className="ua-row-desc">{fra.description}</p>}
                    <p className="ua-row-desc">Target: ${fra.targetAmount?.toLocaleString()}</p>
                    <p className="ua-row-desc">Category: {fra.category || '—'}</p>
                    <p className="ua-row-desc">Created: {new Date(fra.createdAt).toLocaleDateString()}</p>

                    <div style={{ display: 'flex', gap: '16px', margin: '0.5rem 0', fontSize: '0.8rem', color: 'var(--ua-muted)', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>👁 {fra.viewCount} views</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🔖 {fra.shortlistCount} shortlists</span>
                    </div>

                    <div className="ua-row-actions" style={{ marginTop: '0.75rem' }}>
                      <StatusBadge status={fra.status} />
                      {message[fra._id] && (
                        <span style={{ fontSize: '12px', color: 'var(--ua-accent)' }}>
                          {message[fra._id]}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}