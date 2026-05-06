import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api/users-account'

function ReadField({ label, value }) {
  return (
    <div className="ua-field">
      <label className="ua-label">{label}</label>
      <input className="ua-input" value={value || '-'} disabled style={{ opacity: 0.75, cursor: 'default' }} readOnly />
    </div>
  )
}

export default function UA_UserAccount_View({ accountId, onNavigate }) {
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${API}/${accountId}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setAccount(data.data)
      else setError(data.message)
    } catch { setError('Error connecting to server') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [accountId])

  const suspend = async () => {
    try {
      await fetch(`${API}/${accountId}/suspend`, { method: 'PATCH', credentials: 'include' })
      load()
    } catch {}
  }

  if (loading) return <div className="ua-card"><p className="ua-muted">Loading…</p></div>
  if (error)   return <div className="ua-card"><div className="ua-msg ua-msg-error">{error}</div></div>
  if (!account) return null

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Account Details</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
          <button className="ua-btn ua-btn-sm" onClick={() => onNavigate('update', accountId)}>Update</button>
        </div>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <p className="ua-muted" style={{ fontSize: '0.72rem' }}>Account ID: {account._id}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          <div className="ua-avatar" style={{ width: 42, height: 42, fontSize: 14 }}>
            {(account.username || '?').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="ua-row-name" style={{ fontSize: '1rem' }}>{account.username}</p>
            <span className={`ua-badge ${account.isActive ? 'ua-badge-active' : 'ua-badge-inactive'}`}>
              {account.isActive ? 'Active' : 'Suspended'}
            </span>
          </div>
        </div>
      </div>

      <div className="ua-divider" />

      <ReadField label="Username"     value={account.username} />
      <ReadField label="Email"        value={account.email} />
      <ReadField label="User Profile" value={account.userProfile?.profileName} />
      <ReadField label="Date of Birth" value={account.dateOfBirth ? new Date(account.dateOfBirth).toLocaleDateString() : ''} />
      <ReadField label="Phone"        value={account.phone} />
      <ReadField label="Address"      value={account.address} />
      <ReadField label="Member Since" value={account.createdAt ? new Date(account.createdAt).toLocaleDateString() : ''} />

      <div className="ua-row-actions" style={{ marginTop: '1rem' }}>
        <button className="ua-btn-ghost" onClick={suspend}>
          {account.isActive ? 'Suspend Account' : 'Activate Account'}
        </button>
      </div>
    </div>
  )
}
