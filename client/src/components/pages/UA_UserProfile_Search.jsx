import { useState } from 'react'

const API = 'http://localhost:3001/api/user-profiles'

export default function UA_UserProfile_Search({ onNavigate }) {
  const [query, setQuery]     = useState('')
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res  = await fetch(`${API}/search?query=${encodeURIComponent(query.trim())}`, { credentials: 'include' })
      const data = await res.json()
      setProfiles(data.success ? data.data : [])
    } catch { setProfiles([]) }
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
        <span className="ua-card-title">User Profiles</span>
        <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('create')}>+ Create</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
        <input
          className="ua-input"
          style={{ flex: 1 }}
          placeholder="Search by profile name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="ua-btn ua-btn-sm" onClick={handleSearch} disabled={!query.trim()}>Search</button>
      </div>

      {loading && <p className="ua-muted">Searching…</p>}
      {!loading && !searched && <p className="ua-muted">Enter a profile name and press Search</p>}
      {!loading && searched && profiles.length === 0 && <p className="ua-muted">No profiles found</p>}

      <div className="ua-list">
        {profiles.map(p => (
          <div key={p._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="ua-row-dot" style={{ background: p.isActive ? '#4fffb0' : '#e24b4a', flexShrink: 0 }} />
            <div className="ua-row-body" style={{ flex: 1, minWidth: 0 }}>
              <p className="ua-row-name">{p.profileName}</p>
            </div>
            <span className={`ua-badge ${p.isActive ? 'ua-badge-active' : 'ua-badge-inactive'}`}>
              {p.isActive ? 'Active' : 'Suspended'}
            </span>
            <button className="ua-btn-ghost" style={{ fontSize: '0.72rem' }} onClick={() => suspend(p._id)}>
              {p.isActive ? 'Suspend' : 'Activate'}
            </button>
            <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('view', p._id)}>View</button>
            <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('update', p._id)}>Update</button>
          </div>
        ))}
      </div>
    </div>
  )
}
