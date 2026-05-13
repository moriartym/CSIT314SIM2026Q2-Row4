import { useState, useEffect } from 'react'

const API     = 'http://localhost:3001/api/fra'
const CAT_API = 'http://localhost:3001/api/fra-categories'
const PAGE_SIZE = 5

function StatusBadge({ status }) {
  const cls = { active: 'ua-badge-active', suspended: 'ua-badge-inactive', completed: 'ua-badge-completed' }
  return <span className={`ua-badge ${cls[status] || ''}`}>{status}</span>
}

export default function SearchFRA({ onNavigate }) {
  const [tab, setTab]                 = useState('active')
  const [categories, setCategories]   = useState([])
  const [fras, setFras]               = useState([])
  const [query, setQuery]             = useState('')
  const [filterCat, setFilterCat]     = useState('')
  const [from, setFrom]               = useState('')
  const [to, setTo]                   = useState('')
  const [loading, setLoading]         = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [skip, setSkip]               = useState(0)
  const [total, setTotal]             = useState(0)
  const [searched, setSearched]       = useState(false)

  useEffect(() => {
    fetch(`${CAT_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setCategories((d.data || []).filter(c => c.isActive)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setQuery(''); setFilterCat(''); setFrom(''); setTo(''); setSkip(0)
    setFras([]); setTotal(0); setSearched(false)
  }, [tab])

  const fetchCompleted = async (cat, currentSkip = 0, append = false, fromDate = '', toDate = '') => {
    append ? setLoadingMore(true) : setLoading(true)
    try {
      const p = new URLSearchParams()
      if (cat)      p.set('category', cat)
      if (fromDate) p.set('from', fromDate)
      if (toDate)   p.set('to', toDate)
      const res  = await fetch(`${API}/completed?${p.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setFras(data.data)
        setTotal(data.data.length)
        setSkip(0)
        setSearched(true)
      }
    } catch {}
    finally { append ? setLoadingMore(false) : setLoading(false) }
  }

  const fetchSearch = async (q, cat, currentSkip = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    try {
      if (tab === 'completed') {
        const params = new URLSearchParams({ query: q, limit: PAGE_SIZE, skip: currentSkip, status: 'completed' })
        if (cat) params.set('category', cat)
        const res  = await fetch(`${API}/search?${params.toString()}`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setFras(prev => append ? [...prev, ...data.data] : data.data)
          setTotal(data.total)
          setSkip(currentSkip)
          setSearched(true)
        }
      } else {
        const params = new URLSearchParams({ query: q, limit: PAGE_SIZE, skip: currentSkip })
        if (cat) params.set('category', cat)
        const res  = await fetch(`${API}/search?${params.toString()}`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          const filtered = data.data.filter(f => f.status !== 'completed')
          setFras(prev => append ? [...prev, ...filtered] : filtered)
          setTotal(data.total)
          setSkip(currentSkip)
          setSearched(true)
        }
      }
    } catch {}
    finally { append ? setLoadingMore(false) : setLoading(false) }
  }

  const handleSearch = () => {
    setSkip(0)
    if (query.trim()) {
      fetchSearch(query.trim(), filterCat, 0)
    } else if (tab === 'completed') {
      fetchCompleted(filterCat, 0, false, from, to)
    }
  }

  const handleLoadMore = () => {
    const nextSkip = skip + PAGE_SIZE
    if (query.trim()) fetchSearch(query.trim(), filterCat, nextSkip, true)
    else if (tab === 'completed') fetchCompleted(filterCat, nextSkip, true, from, to)
  }

  const refreshList = () => {
    setSkip(0)
    if (query.trim()) fetchSearch(query.trim(), filterCat, 0)
    else if (tab === 'completed') fetchCompleted(filterCat, 0, false, from, to)
  }

  const suspend = async (id) => {
    try {
      await fetch(`${API}/${id}/suspend`, { method: 'PATCH', credentials: 'include' })
      refreshList()
    } catch {}
  }

  const complete = async (id) => {
    try {
      await fetch(`${API}/${id}/complete`, { method: 'PATCH', credentials: 'include' })
      refreshList()
    } catch {}
  }

  return (
    <div className="ua-card">
      <div className="ua-tabs" style={{ marginBottom: '1rem' }}>
        <button className={`ua-tab ${tab === 'active'    ? 'ua-tab-active' : ''}`} onClick={() => setTab('active')}>Active</button>
        <button className={`ua-tab ${tab === 'completed' ? 'ua-tab-active' : ''}`} onClick={() => setTab('completed')}>Completed</button>
      </div>

      <div className="ua-card-header">
        <span className="ua-card-title">{tab === 'active' ? 'My Campaigns' : 'Completed Campaigns'}</span>
        {tab === 'active' && <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('create')}>+ Create</button>}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        <input
          className="ua-input"
          style={{ flex: 2, minWidth: '140px' }}
          placeholder="Search by campaign title..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <select
          className="ua-input"
          style={{ flex: 1, minWidth: '130px' }}
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button className="ua-btn ua-btn-sm" onClick={handleSearch}>Search</button>
      </div>

      {tab === 'completed' && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <input className="ua-input" type="date" style={{ flex: 1, minWidth: '130px' }} value={from} onChange={e => setFrom(e.target.value)} />
          <input className="ua-input" type="date" style={{ flex: 1, minWidth: '130px' }} value={to}   onChange={e => setTo(e.target.value)} />
          <button className="ua-btn ua-btn-sm" onClick={() => { setSkip(0); fetchCompleted(filterCat, 0, false, from, to) }}>Filter</button>
        </div>
      )}

      {loading && <p className="ua-muted">Loading…</p>}
      {!loading && !searched && <p className="ua-muted">
        {tab === 'active' ? 'Enter a search term to find your campaigns.' : 'Search or use the date filter to view completed campaigns.'}
      </p>}
      {!loading && searched && fras.length === 0 && <p className="ua-muted">No campaigns found.</p>}

      <div className="ua-list">
        {fras.map(fra => (
          <div key={fra._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
              {fra.title.slice(0, 2).toUpperCase()}
            </div>
            <div className="ua-row-body" style={{ flex: 1, minWidth: 0 }}>
              <p className="ua-row-name">{fra.title}</p>
              <p className="ua-row-desc">{fra.category?.name || '-'} · ${fra.targetAmount?.toLocaleString()}</p>
              {tab === 'completed' && fra.completedAt && (
                <p className="ua-row-desc">Completed: {new Date(fra.completedAt).toLocaleDateString()}</p>
              )}
            </div>
            <StatusBadge status={fra.status} />
            {tab === 'active' && fra.status !== 'completed' && (
              <button className="ua-btn-ghost" style={{ fontSize: '0.72rem' }} onClick={() => suspend(fra._id)}>
                {fra.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
            )}
            {tab === 'active' && fra.status === 'active' && (
              <button className="ua-btn-ghost" style={{ fontSize: '0.72rem', color: '#64a0ff', borderColor: '#64a0ff' }} onClick={() => complete(fra._id)}>
                Complete
              </button>
            )}
            <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('view', fra._id)}>View</button>
            {tab === 'active' && fra.status !== 'completed' && (
              <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('update', fra._id)}>Update</button>
            )}
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
