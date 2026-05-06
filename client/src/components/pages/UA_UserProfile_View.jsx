import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api/user-profiles'

const PERMISSION_LABELS = {
  user_management:    'User Management',
  fundraising:        'Fundraising',
  donating:           'Donating',
  platform_management: 'Platform Management',
}

function ReadField({ label, value }) {
  return (
    <div className="ua-field">
      <label className="ua-label">{label}</label>
      <input className="ua-input" value={value || '-'} disabled style={{ opacity: 0.75, cursor: 'default' }} readOnly />
    </div>
  )
}

export default function UA_UserProfile_View({ profileId, onNavigate }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${API}/${profileId}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setProfile(data.data)
      else setError(data.message)
    } catch { setError('Error connecting to server') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [profileId])

  const suspend = async () => {
    try {
      await fetch(`${API}/${profileId}/suspend`, { method: 'PATCH', credentials: 'include' })
      load()
    } catch {}
  }

  if (loading) return <div className="ua-card"><p className="ua-muted">Loading…</p></div>
  if (error)   return <div className="ua-card"><div className="ua-msg ua-msg-error">{error}</div></div>
  if (!profile) return null

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Profile Details</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
          <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('update', profileId)}>Update</button>
        </div>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <p className="ua-muted" style={{ fontSize: '0.72rem' }}>Profile ID: {profile._id}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          <div className="ua-row-dot" style={{ background: profile.isActive ? '#4fffb0' : '#e24b4a', width: 10, height: 10, borderRadius: '50%' }} />
          <p className="ua-row-name" style={{ fontSize: '1rem' }}>{profile.profileName}</p>
          <span className={`ua-badge ${profile.isActive ? 'ua-badge-active' : 'ua-badge-inactive'}`}>
            {profile.isActive ? 'Active' : 'Suspended'}
          </span>
        </div>
      </div>

      <div className="ua-divider" />

      <ReadField label="Profile Name" value={profile.profileName} />
      <ReadField label="Description"  value={profile.description} />

      <div className="ua-field">
        <label className="ua-label">Permissions</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          {profile.permissions?.length > 0
            ? profile.permissions.map(perm => (
                <span key={perm} className="ua-perm-badge">{PERMISSION_LABELS[perm] || perm.replace(/_/g, ' ')}</span>
              ))
            : <span className="ua-muted" style={{ fontSize: '0.8rem' }}>No permissions assigned</span>
          }
        </div>
      </div>

      <div className="ua-row-actions" style={{ marginTop: '1rem' }}>
        <button className="ua-btn-ghost" onClick={suspend}>
          {profile.isActive ? 'Suspend Profile' : 'Activate Profile'}
        </button>
      </div>
    </div>
  )
}
