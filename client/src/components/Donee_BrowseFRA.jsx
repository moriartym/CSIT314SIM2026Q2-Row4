import { useState, useEffect } from 'react'
import Donee_BrowseFRA_View from './pages/Donee_BrowseFRA_View'

const API     = 'http://localhost:3001/api/fra'
const DON_API = 'http://localhost:3001/api/fra/donations'
const FAV_API = 'http://localhost:3001/api/favourites'
const CAT_API = 'http://localhost:3001/api/fra-categories'
const PAGE_SIZE = 5

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
      if (data.success) onSuccess()
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

function BrowseList({ onView }) {
  const [tab, setTab]               = useState('active')
  const [fras, setFras]             = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
  const [savedIds, setSavedIds]     = useState(new Set())
  const [favLoading, setFavLoading] = useState(new Set())
  const [donateTarget, setDonateTarget] = useState(null)
  const [skip, setSkip]             = useState(0)
  const [total, setTotal]           = useState(0)

  useEffect(() => {
    fetch(`${CAT_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setCategories((d.data || []).filter(c => c.isActive)) })
      .catch(() => {})
    fetchFavourites()
  }, [])

  const fetchFavourites = async () => {
    try {
      const res  = await fetch(`${FAV_API}/search?query=`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setSavedIds(new Set(data.data.map(f => f.fra?._id?.toString() ?? f.fra?.toString())))
    } catch {}
  }

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

  const handleFavourite = async (e, fraId) => {
    e.stopPropagation()
    if (favLoading.has(fraId)) return
    const alreadySaved = savedIds.has(fraId)
    setFavLoading(prev => new Set([...prev, fraId]))
    try {
      const res  = await fetch(`${FAV_API}/${fraId}`, { method: alreadySaved ? 'DELETE' : 'POST', credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setSavedIds(prev => { const next = new Set(prev); alreadySaved ? next.delete(fraId) : next.add(fraId); return next })
        setFras(prev => prev.map(f => f._id === fraId ? { ...f, shortlistCount: (f.shortlistCount ?? 0) + (alreadySaved ? -1 : 1) } : f))
      }
    } catch {}
    finally { setFavLoading(prev => { const next = new Set(prev); next.delete(fraId); return next }) }
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
        {fras.map(fra => {
          const isSaved      = savedIds.has(fra._id)
          const isFavLoading = favLoading.has(fra._id)
          return (
            <div key={fra._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
                {fra.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="ua-row-body" style={{ flex: 1, minWidth: 0 }}>
                <p className="ua-row-name">{fra.title}</p>
                <p className="ua-row-desc">{fra.category?.name ?? '-'} · ${fra.targetAmount?.toLocaleString()}</p>
              </div>
              <StatusBadge status={fra.status} />
              {fra.status === 'active' && (
                <>
                  <button
                    className="ua-btn ua-btn-sm"
                    onClick={e => { e.stopPropagation(); setDonateTarget(fra) }}
                    title="Donate"
                  >
                    💳
                  </button>
                  <button
                    className="ua-btn-ghost"
                    style={{ padding: '2px 8px', fontSize: '16px', color: isSaved ? '#e53e3e' : 'inherit', border: 'none', background: 'none', cursor: isFavLoading ? 'not-allowed' : 'pointer', opacity: isFavLoading ? 0.5 : 1 }}
                    onClick={(e) => handleFavourite(e, fra._id)}
                    disabled={isFavLoading}
                    title={isSaved ? 'Remove from favourites' : 'Save to favourites'}
                  >
                    {isSaved ? '♥' : '♡'}
                  </button>
                </>
              )}
              <button className="ua-btn ua-btn-sm" onClick={() => onView(fra._id)}>View</button>
            </div>
          )
        })}
      </div>

      {fras.length < total && (
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button className="ua-btn-ghost" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : `Load More (${total - fras.length} remaining)`}
          </button>
        </div>
      )}

      {donateTarget && (
        <DonateModal
          fra={donateTarget}
          onClose={() => setDonateTarget(null)}
          onSuccess={() => setDonateTarget(null)}
        />
      )}
    </div>
  )
}

export default function BrowseCampaigns() {
  const [page, setPage]         = useState('list')
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">Browse Campaigns</h2>
        <p className="ua-subtitle">Discover and support fundraising campaigns</p>
      </div>

      {page === 'list' && (
        <BrowseList onView={id => { setSelectedId(id); setPage('view') }} />
      )}
      {page === 'view' && (
        <Donee_BrowseFRA_View fraId={selectedId} onBack={() => setPage('list')} />
      )}
    </div>
  )
}