import { useState } from 'react'
import Donee_Favourites_View from './pages/Donee_Favourites_View'

const FAV_API  = 'http://localhost:3001/api/favourites'
const PAGE_SIZE = 5

function StatusBadge({ status }) {
  const cls = { active: 'ua-badge-active', suspended: 'ua-badge-inactive', completed: 'ua-badge-completed' }
  return <span className={`ua-badge ${cls[status] || ''}`}>{status}</span>
}

function FavouriteList({ onView }) {
  const [favourites, setFavourites]   = useState([])
  const [loading, setLoading]         = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]             = useState(null)
  const [search, setSearch]           = useState('')
  const [favLoading, setFavLoading]   = useState(new Set())
  const [skip, setSkip]               = useState(0)
  const [total, setTotal]             = useState(0)
  const [searched, setSearched]       = useState(false)

  const fetchSearch = async (query, currentSkip = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ query, limit: PAGE_SIZE, skip: currentSkip })
      const res  = await fetch(`${FAV_API}/search?${params.toString()}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setFavourites(prev => append ? [...prev, ...data.data] : data.data)
        setTotal(data.total)
        setSkip(currentSkip)
        setSearched(true)
      } else {
        setError(data.message)
      }
    } catch { setError('Error connecting to server') }
    finally { append ? setLoadingMore(false) : setLoading(false) }
  }

  const handleSearch = () => {
    if (!search.trim()) return
    setSkip(0)
    fetchSearch(search.trim())
  }

  const handleLoadMore = () => {
    const nextSkip = skip + PAGE_SIZE
    fetchSearch(search.trim(), nextSkip, true)
  }

  const handleUnfavourite = async (e, fraId, favId) => {
    e.stopPropagation()
    if (favLoading.has(favId)) return
    setFavLoading(prev => new Set([...prev, favId]))
    try {
      const res  = await fetch(`${FAV_API}/${fraId}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setSkip(0)
        if (search.trim()) fetchSearch(search.trim(), 0)
        else { setFavourites([]); setTotal(0); setSearched(false) }
      }
    } catch {}
    finally { setFavLoading(prev => { const next = new Set(prev); next.delete(favId); return next }) }
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Saved campaigns</span>
      </div>

      <div className="ua-field" style={{ display: 'flex', gap: '8px' }}>
        <input
          className="ua-input"
          placeholder="Search favourites..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <button className="ua-btn ua-btn-sm" onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="ua-muted">Loading…</p>}
      {error   && <div className="ua-msg ua-msg-error">{error}</div>}
      {!loading && !error && !searched && <p className="ua-muted">Enter a search term to view your saved campaigns.</p>}
      {!loading && !error && searched && favourites.length === 0 && <p className="ua-muted">No favourites found.</p>}

      <div className="ua-list">
        {favourites.map(fav => {
          const fra       = fav.fra
          const isLoading = favLoading.has(fav._id)
          if (!fra) return null
          return (
            <div key={fav._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
                {fra.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="ua-row-body" style={{ flex: 1, minWidth: 0 }}>
                <p className="ua-row-name">{fra.title}</p>
                <p className="ua-row-desc">{fra.category?.name ?? '-'} · ${fra.targetAmount?.toLocaleString()}</p>
              </div>
              <StatusBadge status={fra.status} />
              <button
                className="ua-btn-ghost"
                style={{ padding: '2px 8px', fontSize: '16px', color: '#e53e3e', border: 'none', background: 'none', opacity: isLoading ? 0.5 : 1 }}
                onClick={(e) => handleUnfavourite(e, fra._id, fav._id)}
                disabled={isLoading}
                title="Remove from favourites"
              >
                ♥
              </button>
              <button className="ua-btn ua-btn-sm" onClick={() => onView(fra._id, fav._id)}>View</button>
            </div>
          )
        })}
      </div>

      {favourites.length < total && (
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button className="ua-btn-ghost" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : `Load More (${total - favourites.length} remaining)`}
          </button>
        </div>
      )}
    </div>
  )
}

export default function Favourites() {
  const [page, setPage]     = useState('list')
  const [selected, setSelected] = useState(null)

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">My Favourites</h2>
        <p className="ua-subtitle">Fundraising activities you have saved</p>
      </div>

      {page === 'list' && (
        <FavouriteList onView={(fraId, favId) => { setSelected({ fraId, favId }); setPage('view') }} />
      )}
      {page === 'view' && (
        <Donee_Favourites_View
          fraId={selected?.fraId}
          favId={selected?.favId}
          onBack={() => setPage('list')}
          onRemoved={() => setPage('list')}
        />
      )}
    </div>
  )
}
