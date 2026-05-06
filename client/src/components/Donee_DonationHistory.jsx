import { useState, useEffect } from 'react'
import Donee_DonationHistory_View from './pages/Donee_DonationHistory_View'

const API     = 'http://localhost:3001/api/fra'
const CAT_API = 'http://localhost:3001/api/fra-categories'
const PAGE_SIZE = 5

function StatusBadge({ status }) {
  const cls = { active: 'ua-badge-active', suspended: 'ua-badge-inactive', completed: 'ua-badge-completed' }
  return <span className={`ua-badge ${cls[status] || ''}`}>{status}</span>
}

function DonationList({ onView }) {
  const [categories, setCategories]     = useState([])
  const [donations, setDonations]       = useState([])
  const [loading, setLoading]           = useState(false)
  const [loadingMore, setLoadingMore]   = useState(false)
  const [error, setError]               = useState(null)
  const [filters, setFilters]           = useState({ category: '', from: '', to: '' })
  const [search, setSearch]             = useState('')
  const [skip, setSkip]                 = useState(0)
  const [total, setTotal]               = useState(0)

  useEffect(() => {
    fetch(`${CAT_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setCategories((d.data || []).filter(c => c.isActive)) })
      .catch(() => {})
  }, [])

  const fetchList = async (currentFilters, currentSkip = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ limit: PAGE_SIZE, skip: currentSkip })
      if (currentFilters.category) params.set('category', currentFilters.category)
      if (currentFilters.from)     params.set('from', currentFilters.from)
      if (currentFilters.to)       params.set('to', currentFilters.to)
      const res  = await fetch(`${API}/donations?${params.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setDonations(prev => append ? [...prev, ...data.data] : data.data)
        setTotal(data.total)
        setSkip(currentSkip)
      } else {
        setError(data.message)
      }
    } catch { setError('Error connecting to server') }
    finally { append ? setLoadingMore(false) : setLoading(false) }
  }

  const fetchSearch = async (currentFilters, query, currentSkip = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ limit: PAGE_SIZE, skip: currentSkip, query })
      if (currentFilters.category) params.set('category', currentFilters.category)
      if (currentFilters.from)     params.set('from', currentFilters.from)
      if (currentFilters.to)       params.set('to', currentFilters.to)
      const res  = await fetch(`${API}/donations/search?${params.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setDonations(prev => append ? [...prev, ...data.data] : data.data)
        setTotal(data.total)
        setSkip(currentSkip)
      } else {
        setError(data.message)
      }
    } catch { setError('Error connecting to server') }
    finally { append ? setLoadingMore(false) : setLoading(false) }
  }

  useEffect(() => { fetchList(filters) }, [])

  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSearch = () => {
    setSkip(0)
    if (search.trim()) fetchSearch(filters, search.trim())
    else fetchList(filters)
  }

  const handleLoadMore = () => {
    const nextSkip = skip + PAGE_SIZE
    if (search.trim()) fetchSearch(filters, search.trim(), nextSkip, true)
    else fetchList(filters, nextSkip, true)
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">My donations</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        <select className="ua-input" style={{ flex: 1, minWidth: '140px' }} name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input className="ua-input" style={{ flex: 1, minWidth: '120px' }} name="from" type="date" value={filters.from} onChange={handleFilterChange} />
        <input className="ua-input" style={{ flex: 1, minWidth: '120px' }} name="to"   type="date" value={filters.to}   onChange={handleFilterChange} />
      </div>

      <div className="ua-field" style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          className="ua-input"
          placeholder="Search by campaign name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <button className="ua-btn ua-btn-sm" onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="ua-muted">Loading…</p>}
      {error   && <div className="ua-msg ua-msg-error">{error}</div>}
      {!loading && !error && donations.length === 0 && <p className="ua-muted">No donation records found</p>}

      <div className="ua-list">
        {donations.map(donation => {
          const fra     = donation.fra
          const catName = fra?.category?.name ?? fra?.category ?? '-'
          return (
            <div key={donation._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
                {fra?.title?.slice(0, 2).toUpperCase() || 'NA'}
              </div>
              <div className="ua-row-body" style={{ flex: 1, minWidth: 0 }}>
                <p className="ua-row-name">{fra?.title || 'Unknown Campaign'}</p>
                <p className="ua-row-desc">{catName} · {new Date(donation.donatedAt).toLocaleDateString()}</p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ua-accent)', flexShrink: 0 }}>
                ${donation.amount?.toLocaleString()}
              </span>
              {fra?.status && <StatusBadge status={fra.status} />}
              <button className="ua-btn ua-btn-sm" onClick={() => onView(donation)}>View</button>
            </div>
          )
        })}
      </div>

      {donations.length < total && (
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button className="ua-btn-ghost" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : `Load More (${total - donations.length} remaining)`}
          </button>
        </div>
      )}
    </div>
  )
}

export default function DonationHistory() {
  const [page, setPage]                     = useState('list')
  const [selectedDonation, setSelectedDonation] = useState(null)

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">Donation History</h2>
        <p className="ua-subtitle">View and search your past donations</p>
      </div>

      {page === 'list' && (
        <DonationList onView={donation => { setSelectedDonation(donation); setPage('view') }} />
      )}
      {page === 'view' && (
        <Donee_DonationHistory_View donation={selectedDonation} onBack={() => setPage('list')} />
      )}
    </div>
  )
}