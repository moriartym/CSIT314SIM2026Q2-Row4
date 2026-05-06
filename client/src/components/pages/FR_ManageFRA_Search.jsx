import { useState, useEffect } from 'react'

const API     = 'http://localhost:3001/api/fra'
const CAT_API = 'http://localhost:3001/api/fra-categories'
const PAGE_SIZE = 5

function StatusBadge({ status }) {
  const cls = { active: 'ua-badge-active', suspended: 'ua-badge-inactive', completed: 'ua-badge-completed' }
  return <span className={`ua-badge ${cls[status] || ''}`}>{status}</span>
}

export default function FR_ManageFRA_Search({ onNavigate }) {
  const [categories, setCategories]   = useState([])
  const [fras, setFras]               = useState([])
  const [query, setQuery]             = useState('')
  const [filterCat, setFilterCat]     = useState('')
  const [loading, setLoading]         = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [skip, setSkip]               = useState(0)
  const [total, setTotal]             = useState(0)

  useEffect(() => {
    fetch(`${CAT_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setCategories((d.data || []).filter(c => c.isActive)) })
      .catch(() => {})

    fetchList('', 0)
  }, [])

  const fetchList = async (cat, currentSkip = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    try {
      const params = new URLSearchParams({ limit: PAGE_SIZE, skip: currentSkip })
      if (cat) params.set('category', cat)
      const res  = await fetch(`${API}/mine?${params.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setFras(prev => append ? [...prev, ...data.data] : data.data)
        setTotal(data.total)
        setSkip(currentSkip)
      }
    } catch {}
    finally { append ? setLoadingMore(false) : setLoading(false) }
  }

  const fetchSearch = async (q, cat, currentSkip = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    try {
      const params = new URLSearchParams({ query: q, limit: PAGE_SIZE, skip: currentSkip })
      if (cat) params.set('category', cat)
      const res  = await fetch(`${API}/search?${params.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setFras(prev => append ? [...prev, ...data.data] : data.data)
        setTotal(data.total)
        setSkip(currentSkip)
      }
    } catch {}
    finally { append ? setLoadingMore(false) : setLoading(false) }
  }

  const handleSearch = () => {
    setSkip(0)
    if (query.trim()) fetchSearch(query.trim(), filterCat)
    else fetchList(filterCat)
  }

  const handleCatChange = (e) => {
    setFilterCat(e.target.value)
  }

  const handleLoadMore = () => {
    const nextSkip = skip + PAGE_SIZE
    if (query.trim()) fetchSearch(query.trim(), filterCat, nextSkip, true)
    else fetchList(filterCat, nextSkip, true)
  }

  const refreshList = () => {
    setSkip(0)
    if (query.trim()) fetchSearch(query.trim(), filterCat)
    else fetchList(filterCat)
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
      <div className="ua-card-header">
        <span className="ua-card-title">My Campaigns</span>
        <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('create')}>+ Create</button>
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
          onChange={handleCatChange}
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button className="ua-btn ua-btn-sm" onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="ua-muted">Loading…</p>}
      {!loading && fras.length === 0 && <p className="ua-muted">No campaigns found</p>}

      <div className="ua-list">
        {fras.map(fra => (
          <div key={fra._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
              {fra.title.slice(0, 2).toUpperCase()}
            </div>
            <div className="ua-row-body" style={{ flex: 1, minWidth: 0 }}>
              <p className="ua-row-name">{fra.title}</p>
              <p className="ua-row-desc">{fra.category?.name || '-'} · ${fra.targetAmount?.toLocaleString()}</p>
            </div>
            <StatusBadge status={fra.status} />
            {fra.status !== 'completed' && (
              <button className="ua-btn-ghost" style={{ fontSize: '0.72rem' }} onClick={() => suspend(fra._id)}>
                {fra.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
            )}
            {fra.status === 'active' && (
              <button className="ua-btn-ghost" style={{ fontSize: '0.72rem', color: '#64a0ff', borderColor: '#64a0ff' }} onClick={() => complete(fra._id)}>
                Complete
              </button>
            )}
            <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('view', fra._id)}>View</button>
            {fra.status !== 'completed' && (
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