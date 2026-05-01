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
      <div style={{ background: 'var(--ua-border)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          borderRadius: '999px',
          background: 'var(--ua-accent)',
          width: `${pct}%`,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--ua-muted)', marginTop: '3px' }}>
        {pct.toFixed(1)}% funded
      </p>
    </div>
  )
}

export default function ViewCampaigns() {
  const [tab, setTab]                         = useState('active')
  const [fras, setFras]                       = useState([])
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState(null)
  const [expandedId, setExpanded]             = useState(null)
  const [expandedData, setExpandedData]       = useState(null)
  const [expandedLoading, setExpandedLoading] = useState(false)
  const [search, setSearch]                   = useState('')

  const fetchFRAs = async (status, query = '') => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({ query, status })
      const res  = await fetch(`${API}/all/search?${params.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setFras(data.data)
      else setError(data.message)
    } catch {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSearch('')
    setExpanded(null)
    setExpandedData(null)
    fetchFRAs(tab)
  }, [tab])

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearch(query)
    setExpanded(null)
    setExpandedData(null)
    fetchFRAs(tab, query)
  }

  const handleExpand = async (id) => {
    if (expandedId === id) {
      setExpanded(null)
      setExpandedData(null)
      return
    }
    setExpanded(id)
    setExpandedData(null)
    setExpandedLoading(true)
    try {
      const res  = await fetch(`${API}/${id}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setExpandedData(data.data)
    } catch { /* ignore */ } finally {
      setExpandedLoading(false)
    }
  }

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">All Campaigns</h2>
        <p className="ua-subtitle">View all fundraising campaigns on the platform</p>
      </div>

      <div className="ua-tabs" style={{ marginBottom: '24px' }}>
        {['active', 'completed'].map(t => (
          <button
            key={t}
            className={`ua-tab ${tab === t ? 'ua-tab-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="ua-card">
        <div className="ua-card-header">
          <span className="ua-card-title">{tab === 'active' ? 'Active campaigns' : 'Completed campaigns'}</span>
          <button className="ua-btn ua-btn-sm" onClick={() => fetchFRAs(tab, search)}>Refresh</button>
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
            const isExpanded   = expandedId === fra._id
            const categoryName = fra.category?.name ?? fra.category ?? '-'

            return (
              <div key={fra._id} className="ua-row ua-row-expandable">
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                  onClick={() => handleExpand(fra._id)}
                >
                  <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                    {fra.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="ua-row-body">
                    <p className="ua-row-name">{fra.title}</p>
                    <p className="ua-row-desc">{categoryName} · ${fra.targetAmount?.toLocaleString()}</p>
                  </div>
                  <StatusBadge status={fra.status} />
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--ua-border-2)', marginTop: '12px', paddingTop: '14px' }}>
                    {expandedLoading && <p className="ua-muted">Loading...</p>}
                    {!expandedLoading && expandedData && (
                      <>
                        <p className="ua-muted" style={{ fontSize: '0.72rem', marginBottom: '0.5rem' }}>ID: {expandedData._id}</p>

                        {expandedData.description && (
                          <p className="ua-row-desc" style={{ marginBottom: '0.75rem' }}>{expandedData.description}</p>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                          <div style={{ padding: '10px', background: 'var(--ua-bg)', borderRadius: '6px', border: '1px solid var(--ua-border)' }}>
                            <p className="ua-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>TARGET AMOUNT</p>
                            <p style={{ color: 'var(--ua-accent)', fontWeight: 600 }}>${expandedData.targetAmount?.toLocaleString()}</p>
                          </div>
                          <div style={{ padding: '10px', background: 'var(--ua-bg)', borderRadius: '6px', border: '1px solid var(--ua-border)' }}>
                            <p className="ua-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>TOTAL RAISED</p>
                            <p style={{ color: 'var(--ua-accent)', fontWeight: 600 }}>${(expandedData.totalRaised ?? 0).toLocaleString()}</p>
                          </div>
                          <div style={{ padding: '10px', background: 'var(--ua-bg)', borderRadius: '6px', border: '1px solid var(--ua-border)' }}>
                            <p className="ua-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>VIEWS</p>
                            <p style={{ color: 'var(--ua-text)', fontWeight: 600 }}>👁 {expandedData.viewCount}</p>
                          </div>
                          <div style={{ padding: '10px', background: 'var(--ua-bg)', borderRadius: '6px', border: '1px solid var(--ua-border)' }}>
                            <p className="ua-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>SHORTLISTS</p>
                            <p style={{ color: 'var(--ua-text)', fontWeight: 600 }}>🔖 {expandedData.shortlistCount}</p>
                          </div>
                          <div style={{ padding: '10px', background: 'var(--ua-bg)', borderRadius: '6px', border: '1px solid var(--ua-border)' }}>
                            <p className="ua-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>CREATED</p>
                            <p style={{ color: 'var(--ua-text)', fontWeight: 600 }}>{new Date(expandedData.createdAt).toLocaleDateString()}</p>
                          </div>
                          {expandedData.completedAt && (
                            <div style={{ padding: '10px', background: 'var(--ua-bg)', borderRadius: '6px', border: '1px solid var(--ua-border)' }}>
                              <p className="ua-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>COMPLETED</p>
                              <p style={{ color: 'var(--ua-text)', fontWeight: 600 }}>{new Date(expandedData.completedAt).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>

                        <ProgressBar totalRaised={expandedData.totalRaised ?? 0} targetAmount={expandedData.targetAmount ?? 0} />
                      </>
                    )}
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