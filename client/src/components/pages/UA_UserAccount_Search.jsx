import { useState } from 'react'

const API = 'http://localhost:3001/api/users-account'

export default function UA_UserAccount_Search({ onNavigate }) {
  const [query, setQuery]       = useState('')
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res  = await fetch(`${API}/search?query=${encodeURIComponent(query.trim())}`, { credentials: 'include' })
      const data = await res.json()
      setAccounts(data.success ? data.data : [])
    } catch { setAccounts([]) }
    finally { setLoading(false) }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  const suspend = async (id) => {
    try {
      await fetch(`${API}/${id}/suspend`, { method: 'PATCH', credentials: 'include' })
      handleSearch()
    } catch {}
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">User Accounts</span>
        <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('create')}>+ Create</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
        <input
          className="ua-input"
          style={{ flex: 1 }}
          placeholder="Search by username..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="ua-btn ua-btn-sm" onClick={handleSearch} disabled={!query.trim()}>Search</button>
      </div>

      {loading && <p className="ua-muted">Searching…</p>}
      {!loading && !searched && <p className="ua-muted">Enter a username and press Search</p>}
      {!loading && searched && accounts.length === 0 && <p className="ua-muted">No users found</p>}

      <div className="ua-list">
        {accounts.map(u => (
          <div key={u._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="ua-avatar" style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
              {(u.username || '?').slice(0, 2).toUpperCase()}
            </div>
            <div className="ua-row-body" style={{ flex: 1, minWidth: 0 }}>
              <p className="ua-row-name">{u.username}</p>
              <p className="ua-row-desc">{u.email} · {u.userProfile?.profileName || '-'}</p>
            </div>
            <span className={`ua-badge ${u.isActive ? 'ua-badge-active' : 'ua-badge-inactive'}`}>
              {u.isActive ? 'Active' : 'Suspended'}
            </span>
            <button className="ua-btn-ghost" style={{ fontSize: '0.72rem' }} onClick={() => suspend(u._id)}>
              {u.isActive ? 'Suspend' : 'Activate'}
            </button>
            <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('view', u._id)}>View</button>
            <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('update', u._id)}>Update</button>
          </div>
        ))}
      </div>
    </div>
  )
}
