import { useState, useEffect } from 'react'

const API      = 'http://localhost:3001/api/users-account'
const PROF_API = 'http://localhost:3001/api/user-profiles'

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PW_RE    = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

function validate(field, value) {
  if (field === 'email') {
    if (!value) return 'Email is required'
    if (!EMAIL_RE.test(value)) return 'Invalid email format'
  }
  if (field === 'password') {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'At least 8 characters'
    if (!PW_RE.test(value)) return 'Must include uppercase, lowercase, number & symbol'
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

export default function UA_UserAccount_Create({ onNavigate }) {
  const [profiles, setProfiles] = useState([])
  const [form, setForm]         = useState({ username: '', email: '', password: '', userProfile: '', dateOfBirth: '', phone: '', address: '' })
  const [errors, setErrors]     = useState({})
  const [message, setMessage]   = useState(null)

  useEffect(() => {
    fetch(`${PROF_API}/all`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.success) setProfiles(d.data.filter(p => p.isActive)) })
      .catch(() => {})
  }, [])

  const effectiveProfile = form.userProfile || profiles[0]?._id || ''

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'email' || name === 'password') setErrors(prev => ({ ...prev, [name]: validate(name, value) }))
    setMessage(null)
  }

  const handleSubmit = async () => {
    const emailErr = validate('email', form.email)
    const pwErr    = validate('password', form.password)
    if (!form.username.trim()) { setErrors({ username: 'Username is required', email: emailErr, password: pwErr }); return }
    if (emailErr || pwErr)     { setErrors({ email: emailErr, password: pwErr }); return }
    if (!effectiveProfile)     { setErrors({ userProfile: 'Profile is required' }); return }

    const body = { username: form.username.trim(), email: form.email.trim(), password: form.password, userProfile: effectiveProfile }
    if (form.dateOfBirth)    body.dateOfBirth = form.dateOfBirth
    if (form.phone.trim())   body.phone       = form.phone.trim()
    if (form.address.trim()) body.address     = form.address.trim()

    try {
      const res  = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: `User created! ID: ${data.data._id}` })
        setForm({ username: '', email: '', password: '', userProfile: '', dateOfBirth: '', phone: '', address: '' })
        setErrors({})
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
        <span className="ua-card-title">New User</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onNavigate('search')}>← Back</button>
      </div>

      <Field label="Username" error={errors.username}>
        <input className={`ua-input ${errors.username ? 'ua-input-err' : ''}`} name="username" placeholder="e.g. johndoe" value={form.username} onChange={handleChange} />
      </Field>

      <Field label="Email" error={errors.email}>
        <input className={`ua-input ${errors.email ? 'ua-input-err' : ''}`} name="email" placeholder="user@example.com" value={form.email} onChange={handleChange} />
      </Field>

      <Field label="Password" error={errors.password}>
        <input className={`ua-input ${errors.password ? 'ua-input-err' : ''}`} name="password" type="password" placeholder="Min 8 chars, upper, lower, number, symbol" value={form.password} onChange={handleChange} />
      </Field>

      <Field label="User Profile" error={errors.userProfile}>
        <select className="ua-input" name="userProfile" value={effectiveProfile} onChange={handleChange}>
          {profiles.map(p => <option key={p._id} value={p._id}>{p.profileName}</option>)}
        </select>
      </Field>

      <Field label={<>Date of Birth <span className="ua-optional">(optional)</span></>}>
        <input className="ua-input" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
      </Field>

      <Field label={<>Phone <span className="ua-optional">(optional)</span></>}>
        <input className="ua-input" name="phone" placeholder="+65 9123 4567" value={form.phone} onChange={handleChange} />
      </Field>

      <Field label={<>Address <span className="ua-optional">(optional)</span></>}>
        <input className="ua-input" name="address" placeholder="123 Street, City" value={form.address} onChange={handleChange} />
      </Field>

      <button className="ua-btn" onClick={handleSubmit}>Create User</button>
      {message && <div className={`ua-msg ${message.type === 'success' ? 'ua-msg-success' : 'ua-msg-error'}`}>{message.text}</div>}
    </div>
  )
}
