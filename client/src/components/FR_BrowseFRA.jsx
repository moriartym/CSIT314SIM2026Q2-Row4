import { useState, useEffect } from 'react'
import FR_BrowseFRA_View from './pages/FR_BrowseFRA_View'

const API       = 'http://localhost:3001/api/fra'
const CAT_API   = 'http://localhost:3001/api/fra-categories'
const PAGE_SIZE = 5

function StatusBadge({ status }) {
  const cls = { active: 'ua-badge-active', suspended: 'ua-badge-inactive', completed: 'ua-badge-completed' }
  return <span className={`ua-badge ${cls[status] || ''}`}>{status}</span>
}

function CampaignList({ onView }) {
  const [tab, setTab]               = useState('active')
  const [fras, setFras]             = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
  const [skip, setSkip]             = useState(0)
  const [total, setTotal]           = useState(0)

  useEffect(() => {
    fetch(`${CAT_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setCategories((d.data || []).filter(c => c.isActive)) })
      .catch(() => {})
  }, [])

  const fetchList = async (status, cat, currentSkip = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ status, limit: PAGE_SIZE, skip: currentSkip })
      if (cat) params.set('category', cat)
      const res  = await fetch(`${API}/all?${params.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setFras(prev => append ? [...prev, ...data.data] : data.data)
        setTotal(data.total)
        setSkip(currentSkip)
      } else {
        setError(data.message)
      }
    } catch { setError('Error connecting to server') }
    finally { append ? setLoadingMore(false) : setLoading(false) }
  }

  const fetchSearch = async (status, query, cat, currentSkip = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ status, query, limit: PAGE_SIZE, skip: currentSkip })
      if (cat) params.set('category', cat)
      const res  = await fetch(`${API}/all/search?${params.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setFras(prev => append ? [...prev, ...data.data] : data.data)
        setTotal(data.total)
        setSkip(currentSkip)
      } else {
        setError(data.message)
      }
    } catch { setError('Error connecting to server') }
    finally { append ? setLoadingMore(false) : setLoading(false) }
  }

  useEffect(() => { setSearch(''); setCategory(''); setSkip(0); fetchList(tab, '') }, [tab])

  const handleSearch = () => {
    setSkip(0)
    if (search.trim()) fetchSearch(tab, search.trim(), category)
    else fetchList(tab, category)
  }

  const handleLoadMore = () => {
    const nextSkip = skip + PAGE_SIZE
    if (search.trim()) fetchSearch(tab, search.trim(), category, nextSkip, true)
    else fetchList(tab, category, nextSkip, true)
  }

  return (
    <div className="ua-card">
      <div className="ua-tabs" style={{ marginBottom: '1rem' }}>
        {['active', 'completed'].map(t => (
          <button key={t} className={`ua-tab ${tab === t ? 'ua-tab-active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="ua-card-header">
        <span className="ua-card-title">{tab === 'active' ? 'Active campaigns' : 'Completed campaigns'}</span>
        <button className="ua-btn ua-btn-sm" onClick={() => { setSearch(''); setCategory(''); setSkip(0); fetchList(tab, '') }}>Refresh</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        <select
          className="ua-input"
          style={{ flex: 1, minWidth: '140px' }}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <div className="ua-field" style={{ display: 'flex', gap: '8px' }}>
        <input
          className="ua-input"
          placeholder="Search campaigns..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <button className="ua-btn ua-btn-sm" onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="ua-muted">Loading…</p>}
      {error   && <div className="ua-msg ua-msg-error">{error}</div>}
      {!loading && !error && fras.length === 0 && <p className="ua-muted">No campaigns found</p>}

      <div className="ua-list">
        {fras.map(fra => (
          <div key={fra._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
              {fra.title.slice(0, 2).toUpperCase()}
            </div>
            <div className="ua-row-body" style={{ flex: 1, minWidth: 0 }}>
              <p className="ua-row-name">{fra.title}</p>
              <p className="ua-row-desc">{fra.category?.name ?? '-'} · ${fra.targetAmount?.toLocaleString()}</p>
            </div>
            <StatusBadge status={fra.status} />
            <button className="ua-btn ua-btn-sm" onClick={() => onView(fra._id)}>View</button>
          </div>
        ))}
      </div>

      {fras.length < total && (
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button className="ua-btn-ghost" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : `Load More (${total - fras.length} remaining)`}
          </button>
        </div>
      )}
    </div>
  )
}

export default function ViewCampaigns() {
  const [page, setPage]         = useState('list')
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">All Campaigns</h2>
        <p className="ua-subtitle">View all fundraising campaigns on the platform</p>
      </div>

      {page === 'list' && (
        <CampaignList onView={id => { setSelectedId(id); setPage('view') }} />
      )}
      {page === 'view' && (
        <FR_BrowseFRA_View fraId={selectedId} onBack={() => setPage('list')} />
      )}
    </div>
  )
}