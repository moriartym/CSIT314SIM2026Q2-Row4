import { useState, useEffect } from 'react'

const API      = 'http://localhost:3001/api/users-account'
const PROF_API = 'http://localhost:3001/api/user-profiles'

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PW_RE    = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

function validate(field, value) {
  if (field === 'email'    && value && !EMAIL_RE.test(value)) return 'Invalid email format'
  if (field === 'password' && value) {
    if (value.length < 8)       return 'At least 8 characters'
    if (!PW_RE.test(value))     return 'Must include uppercase, lowercase, number & symbol'
  }
  return null
}

function Field({ label, error, children }) {
  return (
    <div className="ua-field">
      <label className="ua-label">{label}</label>
      {children}
      {error && <p className="ua-err-text">{error}</p>}
    </div>
  )
}

const blankForm = () => ({ username: '', email: '', password: '', userProfile: '', dateOfBirth: '', phone: '', address: '' })

export default function UA_UserAccount_Update({ accountId, onNavigate }) {
  const [profiles, setProfiles]         = useState([])
  const [search, setSearch]             = useState('')
  const [results, setResults]           = useState([])
  const [searching, setSearching]       = useState(false)
  const [selected, setSelected]         = useState(null)
  const [form, setForm]                 = useState(blankForm())
  const [errors, setErrors]             = useState({})
  const [message, setMessage]           = useState(null)

  useEffect(() => {
    fetch(`${PROF_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setProfiles(d.data.filter(p => p.isActive)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (accountId) loadAccount(accountId)
  }, [accountId])

  const loadAccount = async (id) => {
    try {
      const res  = await fetch(`${API}/${id}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        const a = data.data
        setSelected(a)
        setForm({
          username:    a.username    || '',
          email:       a.email       || '',
          password:    '',
          userProfile: a.userProfile?._id || '',
          dateOfBirth: a.dateOfBirth ? a.dateOfBirth.slice(0, 10) : '',
          phone:       a.phone    || '',
          address:     a.address  || '',
        })
      }
    } catch {}
  }

  const handleSearch = async () => {
    if (!search.trim()) return
    setSearching(true)
    try {
      const res  = await fetch(`${API}/search?query=${encodeURIComponent(search.trim())}`, { credentials: 'include' })
      const data = await res.json()
      setResults(data.success ? data.data : [])
    } catch { setResults([]) }
    finally { setSearching(false) }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  const handleSelect = (account) => {
    loadAccount(account._id)
    setResults([])
    setSearch('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'email' || name === 'password') setErrors(prev => ({ ...prev, [name]: validate(name, value) }))
    setMessage(null)
  }

  const handleSubmit = async () => {
    if (!selected) return
    const emailErr = validate('email', form.email)
    const pwErr    = validate('password', form.password)
    if (emailErr || pwErr) { setErrors({ email: emailErr, password: pwErr }); return }

    const body = {}
    if (form.username.trim() && form.username !== selected.username) body.username    = form.username.trim()
    if (form.email.trim()    && form.email    !== selected.email)    body.email       = form.email.trim()
    if (form.password)                                               body.password    = form.password
    if (form.userProfile     && form.userProfile !== (selected.userProfile?._id || selected.userProfile)) body.userProfile = form.userProfile
    if (form.dateOfBirth)                                            body.dateOfBirth = form.dateOfBirth
    if (form.phone.trim()    && form.phone !== selected.phone)       body.phone       = form.phone.trim()
    if (form.address.trim()  && form.address !== selected.address)   body.address     = form.address.trim()

    if (!Object.keys(body).length) { setMessage({ type: 'error', text: 'No changes to save' }); return }

    try {
      const res  = await fetch(`${API}/${selected._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'User updated successfully!' })
        loadAccount(selected._id)
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
        <span className="ua-card-title">Update User</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
      </div>

      {!selected && (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
            <input
              className="ua-input"
              style={{ flex: 1 }}
              placeholder="Search by username..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="ua-btn ua-btn-sm" onClick={handleSearch} disabled={!search.trim()}>Search</button>
          </div>
          {searching && <p className="ua-muted">Searching…</p>}
          {!searching && search.trim() && results.length === 0 && <p className="ua-muted">No users found</p>}
          <div className="ua-list">
            {results.map(u => (
              <div
                key={u._id}
                className="ua-row"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                onClick={() => handleSelect(u)}
              >
                <div className="ua-avatar" style={{ width: 30, height: 30, fontSize: 11 }}>
                  {(u.username || '?').slice(0, 2).toUpperCase()}
                </div>
                <div className="ua-row-body" style={{ flex: 1 }}>
                  <p className="ua-row-name">{u.username}</p>
                  <p className="ua-row-desc">{u.email}</p>
                </div>
                <span className={`ua-badge ${u.isActive ? 'ua-badge-active' : 'ua-badge-inactive'}`}>
                  {u.isActive ? 'Active' : 'Suspended'}
                </span>
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

          <Field label="Username">
            <input className="ua-input" name="username" value={form.username} onChange={handleChange} />
          </Field>

          <Field label="Email" error={errors.email}>
            <input className={`ua-input ${errors.email ? 'ua-input-err' : ''}`} name="email" value={form.email} onChange={handleChange} />
          </Field>

          <Field label={<>New Password <span className="ua-optional">(leave blank to keep)</span></>} error={errors.password}>
            <input className={`ua-input ${errors.password ? 'ua-input-err' : ''}`} name="password" type="password" placeholder="New password (optional)" value={form.password} onChange={handleChange} />
          </Field>

          <Field label="User Profile">
            <select className="ua-input" name="userProfile" value={form.userProfile} onChange={handleChange}>
              <option value="">- no change -</option>
              {profiles.map(p => <option key={p._id} value={p._id}>{p.profileName}</option>)}
            </select>
          </Field>

          <Field label="Date of Birth">
            <input className="ua-input" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
          </Field>

          <Field label="Phone">
            <input className="ua-input" name="phone" value={form.phone} onChange={handleChange} />
          </Field>

          <Field label="Address">
            <input className="ua-input" name="address" value={form.address} onChange={handleChange} />
          </Field>

          <button className="ua-btn" onClick={handleSubmit}>Save Changes</button>
          {message && <div className={`ua-msg ${message.type === 'success' ? 'ua-msg-success' : 'ua-msg-error'}`}>{message.text}</div>}
        </>
      )}
    </div>
  )
}
