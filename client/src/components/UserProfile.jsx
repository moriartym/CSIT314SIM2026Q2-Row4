import { useState, useEffect } from 'react'
import './styles/UserProfile.css'

const API = 'http://localhost:3001/api/user-profiles'

const PERMISSIONS = [
  { value: 'user_management', label: 'User Management', desc: 'Can manage users and profiles' },
  { value: 'fundraising', label: 'Fundraising', desc: 'Can create and manage FRA' },
  { value: 'donating', label: 'Donating', desc: 'Can browse, save, and donate to FRA' },
  { value: 'platform_management', label: 'Platform Management', desc: 'Can manage categories and generate reports' },
]

function PermissionCheckboxes({ selected, onChange }) {
  const toggle = (val) => {
    onChange(
      selected.includes(val)
        ? selected.filter(p => p !== val)
        : [...selected, val]
    )
  }

  return (
    <div className="up-field">
      <label className="up-label">
        Permissions <span className="up-required">*</span>
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {PERMISSIONS.map(p => (
          <label
            key={p.value}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={selected.includes(p.value)}
              onChange={() => toggle(p.value)}
              style={{ accentColor: 'var(--up-accent)', width: '14px', height: '14px' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--up-text)' }}>{p.label}</span>
            <span style={{ fontSize: '11px', color: 'var(--up-muted)' }}>{p.desc}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function UserProfile() {
  const [tab, setTab] = useState('search')

  return (
    <div className="up-container">
      <div className="up-header">
        <h2 className="up-title">User Profiles</h2>
        <p className="up-subtitle">Manage roles available on the platform</p>
      </div>

      <div className="up-tabs">
        {['search', 'create', 'update'].map(t => (
          <button
            key={t}
            className={`up-tab ${tab === t ? 'up-tab-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'search' && <ViewProfiles />}
      {tab === 'create' && <CreateProfile />}
      {tab === 'update' && <UpdateProfile />}
    </div>
  )
}

function ViewProfiles() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  const fetch_ = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/search?query=`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setProfiles(data.data)
      else setError(data.message)
    } catch {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch_() }, [])

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearch(query)

    if (!query.trim()) {
      fetch_()
      return
    }

    try {
      const res = await fetch(
        `${API}/search?query=${encodeURIComponent(query)}`,
        { credentials: 'include' }
      )

      const data = await res.json()

      if (data.success) setProfiles(data.data)
      else setProfiles([])
    } catch (err) {
      console.error(err)
    }
  }

  const suspend = async (id) => {
    try {
      const res = await fetch(`${API}/${id}/suspend`, {
        method: 'PATCH',
        credentials: 'include',
      })

      const data = await res.json()

      if (data.success) {
        search.trim()
          ? handleSearch({ target: { value: search } })
          : fetch_()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="up-card">
      <div className="up-card-header">
        <span className="up-card-title">All profiles</span>
        <button className="up-btn up-btn-sm" onClick={fetch_}>Refresh</button>
      </div>

      <div className="up-field">
        <input
          className="up-input"
          placeholder="Search profiles..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {loading && <p className="up-muted">Loading…</p>}
      {error && <div className="up-msg up-msg-error">{error}</div>}
      {!loading && !error && profiles.length === 0 && (
        <p className="up-muted">No profiles found</p>
      )}

      <div className="up-list">
        {profiles.map(p => {
          const isExpanded = expandedId === p._id

          return (
            <div key={p._id} className="up-row up-row-expandable">
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                onClick={() => setExpandedId(isExpanded ? null : p._id)}
              >
                <div
                  className="up-row-dot"
                  style={{ background: p.isActive ? '#4fffb0' : '#e24b4a' }}
                />

                <div className="up-row-body">
                  <p className="up-row-name">{p.profileName}</p>
                </div>

                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.5 }}>
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>

              {isExpanded && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    marginTop: '0.5rem',
                  }}
                >
                  <p className="up-muted" style={{ fontSize: '0.72rem' }}>
                    ID: {p._id}
                  </p>

                  <p className="up-row-name">{p.profileName}</p>
                  {p.description && <p className="up-row-desc">{p.description}</p>}

                  {p.permissions?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {p.permissions.map(perm => (
                        <span key={perm} className="up-perm-badge">
                          {perm.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="up-row-actions" style={{ marginTop: '0.75rem' }}>
                    <span className={`up-badge ${p.isActive ? 'up-badge-active' : 'up-badge-inactive'}`}>
                      {p.isActive ? 'Active' : 'Suspended'}
                    </span>

                    <button
                      className="up-btn-ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        suspend(p._id)
                      }}
                    >
                      {p.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CreateProfile() {
  const [form, setForm] = useState({ profileName: '', description: '', permissions: [] })
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setMessage(null)
  }

  const handleSubmit = async () => {
    if (!form.profileName.trim()) {
      setMessage({ type: 'error', text: 'Profile name is required' })
      return
    }

    if (!form.permissions.length) {
      setMessage({ type: 'error', text: 'At least one permission is required' })
      return
    }

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: `Profile "${data.data.profileName}" created!` })
        setForm({ profileName: '', description: '', permissions: [] })
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error connecting to server' })
    }
  }

  return (
    <div className="up-card">
      <p className="up-card-title">New profile</p>

      <div className="up-field">
        <label className="up-label">Profile name</label>
        <input
          className="up-input"
          name="profileName"
          value={form.profileName}
          onChange={handleChange}
        />
      </div>

      <div className="up-field">
        <label className="up-label">Description <span className="up-optional">(optional)</span></label>
        <textarea
          className="up-input up-textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <PermissionCheckboxes
        selected={form.permissions}
        onChange={perms => {
          setForm(prev => ({ ...prev, permissions: perms }))
          setMessage(null)
        }}
      />

      <button className="up-btn" onClick={handleSubmit}>Create profile</button>

      {message && (
        <div className={`up-msg ${message.type === 'success' ? 'up-msg-success' : 'up-msg-error'}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}

function UpdateProfile() {
  const [profileId, setProfileId] = useState('')
  const [form, setForm] = useState({ profileName: '', description: '', permissions: [] })
  const [message, setMessage] = useState(null)

  const handleSubmit = async () => {
    if (!profileId.trim()) {
      setMessage({ type: 'error', text: 'Profile ID is required' })
      return
    }

    if (!form.permissions.length) {
      setMessage({ type: 'error', text: 'At least one permission is required' })
      return
    }

    const body = {}

    if (form.profileName.trim()) body.profileName = form.profileName.trim()
    if (form.description.trim()) body.description = form.description.trim()

    body.permissions = form.permissions

    if (!Object.keys(body).length) {
      setMessage({ type: 'error', text: 'No fields to update' })
      return
    }

    try {
      const res = await fetch(`${API}/${profileId.trim()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (data.success) setMessage({ type: 'success', text: 'Profile updated!' })
      else setMessage({ type: 'error', text: data.message })
    } catch {
      setMessage({ type: 'error', text: 'Error connecting to server' })
    }
  }

  return (
    <div className="up-card">
      <p className="up-card-title">Update profile</p>

      <div className="up-field">
        <label className="up-label">
          Profile ID <span className="up-required">*</span>
        </label>

        <input
          className="up-input"
          value={profileId}
          onChange={e => {
            setProfileId(e.target.value)
            setMessage(null)
          }}
        />
      </div>

      <div className="up-divider" />
      <p className="up-hint">Leave fields blank to keep existing values</p>

      <div className="up-field">
        <label className="up-label">Profile name</label>
        <input
          className="up-input"
          value={form.profileName}
          onChange={e => {
            setForm(p => ({ ...p, profileName: e.target.value }))
            setMessage(null)
          }}
        />
      </div>

      <div className="up-field">
        <label className="up-label">Description</label>
        <textarea
          className="up-input up-textarea"
          rows={3}
          value={form.description}
          onChange={e => {
            setForm(p => ({ ...p, description: e.target.value }))
            setMessage(null)
          }}
        />
      </div>

      <PermissionCheckboxes
        selected={form.permissions}
        onChange={perms => {
          setForm(prev => ({ ...prev, permissions: perms }))
          setMessage(null)
        }}
      />

      <button className="up-btn" onClick={handleSubmit}>Save changes</button>

      {message && (
        <div className={`up-msg ${message.type === 'success' ? 'up-msg-success' : 'up-msg-error'}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}