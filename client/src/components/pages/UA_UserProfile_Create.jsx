import { useState } from 'react'

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

export default function UA_UserProfile_Create({ onNavigate }) {
  const [form, setForm]       = useState({ profileName: '', description: '', permissions: [] })
  const [message, setMessage] = useState(null)

  const handleChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setMessage(null) }

  const handleSubmit = async () => {
    if (!form.profileName.trim())  { setMessage({ type: 'error', text: 'Profile name is required' }); return }
    if (!form.permissions.length)  { setMessage({ type: 'error', text: 'At least one permission is required' }); return }

    try {
      const res  = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) })
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
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">New Profile</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
      </div>

      <div className="ua-field">
        <label className="ua-label">Profile Name <span className="ua-required">*</span></label>
        <input className="ua-input" name="profileName" value={form.profileName} onChange={handleChange} />
      </div>

      <div className="ua-field">
        <label className="ua-label">Description <span className="ua-optional">(optional)</span></label>
        <textarea className="ua-input ua-textarea" name="description" value={form.description} onChange={handleChange} rows={3} />
      </div>

      <PermissionCheckboxes
        selected={form.permissions}
        onChange={perms => { setForm(prev => ({ ...prev, permissions: perms })); setMessage(null) }}
      />

      <button className="ua-btn" onClick={handleSubmit}>Create Profile</button>
      {message && <div className={`ua-msg ${message.type === 'success' ? 'ua-msg-success' : 'ua-msg-error'}`}>{message.text}</div>}
    </div>
  )
}
