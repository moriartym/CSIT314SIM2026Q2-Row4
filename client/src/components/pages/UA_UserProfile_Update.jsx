import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api/user-profiles'

const PERMISSIONS = [
  { value: 'user_management',    label: 'User Management',    desc: 'Can manage users and profiles' },
  { value: 'fundraising',        label: 'Fundraising',        desc: 'Can create and manage FRA' },
  { value: 'donating',           label: 'Donating',           desc: 'Can browse, save, and donate to FRA' },
  { value: 'platform_management', label: 'Platform Management', desc: 'Can manage categories and generate reports' },
]

function PermissionCheckboxes({ selected, onChange }) {
  const toggle = (val) => onChange(selected.includes(val) ? selected.filter(p => p !== val) : [...selected, val])
  return (
    <div className="ua-field">
      <label className="ua-label">Permissions <span className="ua-required">*</span></label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {PERMISSIONS.map(p => (
          <label key={p.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={selected.includes(p.value)} onChange={() => toggle(p.value)} style={{ accentColor: 'var(--ua-accent)', width: '14px', height: '14px' }} />
            <span style={{ fontSize: '13px', color: 'var(--ua-text)' }}>{p.label}</span>
            <span style={{ fontSize: '11px', color: 'var(--ua-muted)' }}>{p.desc}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function UA_UserProfile_Update({ profileId, onNavigate }) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState({ profileName: '', description: '', permissions: [] })
  const [message, setMessage]   = useState(null)

  useEffect(() => {
    if (profileId) loadProfile(profileId)
  }, [profileId])

  const loadProfile = async (id) => {
    try {
      const res  = await fetch(`${API}/${id}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        const p = data.data
        setSelected(p)
        setForm({ profileName: p.profileName || '', description: p.description || '', permissions: p.permissions || [] })
      }
    } catch {}
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    try {
      const res  = await fetch(`${API}/search?query=${encodeURIComponent(query.trim())}`, { credentials: 'include' })
      const data = await res.json()
      setResults(data.success ? data.data : [])
    } catch { setResults([]) }
    finally { setSearching(false) }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  const handleSelect = (p) => {
    loadProfile(p._id)
    setResults([])
    setQuery('')
  }

  const handleSubmit = async () => {
    if (!selected) return
    if (!form.permissions.length) { setMessage({ type: 'error', text: 'At least one permission is required' }); return }

    const body = {}
    if (form.profileName.trim()) body.profileName = form.profileName.trim()
    if (form.description.trim()) body.description = form.description.trim()
    body.permissions = form.permissions

    try {
      const res  = await fetch(`${API}/${selected._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        loadProfile(selected._id)
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error connecting to server' })
    }
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Update Profile</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
      </div>

      {!selected && (
        <>
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
          {searching && <p className="ua-muted">Searching…</p>}
          {!searching && query.trim() && results.length === 0 && <p className="ua-muted">No profiles found</p>}
          <div className="ua-list">
            {results.map(p => (
              <div key={p._id} className="ua-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => handleSelect(p)}>
                <div className="ua-row-dot" style={{ background: p.isActive ? '#4fffb0' : '#e24b4a' }} />
                <div className="ua-row-body" style={{ flex: 1 }}>
                  <p className="ua-row-name">{p.profileName}</p>
                </div>
                <span className={`ua-badge ${p.isActive ? 'ua-badge-active' : 'ua-badge-inactive'}`}>{p.isActive ? 'Active' : 'Suspended'}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {selected && (
        <>
          <div style={{ marginBottom: '0.75rem' }}>
            <p className="ua-muted" style={{ fontSize: '0.72rem' }}>ID: {selected._id}</p>
          </div>
          <div className="ua-divider" />
          <p className="ua-hint">Edit the fields you want to change</p>

          <div className="ua-field">
            <label className="ua-label">Profile Name</label>
            <input className="ua-input" value={form.profileName} onChange={e => { setForm(p => ({ ...p, profileName: e.target.value })); setMessage(null) }} />
          </div>

          <div className="ua-field">
            <label className="ua-label">Description</label>
            <textarea className="ua-input ua-textarea" rows={3} value={form.description} onChange={e => { setForm(p => ({ ...p, description: e.target.value })); setMessage(null) }} />
          </div>

          <PermissionCheckboxes
            selected={form.permissions}
            onChange={perms => { setForm(prev => ({ ...prev, permissions: perms })); setMessage(null) }}
          />

          <button className="ua-btn" onClick={handleSubmit}>Save Changes</button>
          {message && <div className={`ua-msg ${message.type === 'success' ? 'ua-msg-success' : 'ua-msg-error'}`}>{message.text}</div>}
        </>
      )}
    </div>
  )
}
