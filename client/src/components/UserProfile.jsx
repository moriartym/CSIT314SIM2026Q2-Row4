import { useState } from 'react'

const API = 'http://localhost:3001/api/users'

export default function UserProfile() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user_admin' })
  const [userId, setUserId] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const createUser = async () => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setMessage(`User created! ID: ${data.data._id}`)
        setUser(data.data)
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Error connecting to server')
    }
  }

  const getUser = async () => {
    try {
      const res = await fetch(`${API}/${userId}`)
      const data = await res.json()
      if (data.success) {
        setUser(data.data)
        setMessage('')
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Error connecting to server')
    }
  }

  const updateUser = async () => {
    try {
      const res = await fetch(`${API}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.data)
        setMessage('User updated!')
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Error connecting to server')
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Profile Management</h2>

      <div style={styles.card}>
        <h3 style={styles.subtitle}>Create / Update User</h3>
        <input style={styles.input} name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input style={styles.input} name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input style={styles.input} name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
        <select style={styles.input} name="role" value={form.role} onChange={handleChange}>
          <option value="user_admin">User Admin</option>
          <option value="fund_raiser">Fund Raiser</option>
          <option value="donee">Donee</option>
          <option value="platform_management">Platform Management</option>
        </select>
        <div style={styles.row}>
          <button style={styles.btn} onClick={createUser}>Create User</button>
          <button style={styles.btn} onClick={updateUser}>Update User</button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.subtitle}>View User</h3>
        <input style={styles.input} placeholder="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button style={styles.btn} onClick={getUser}>Get User</button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {user && (
        <div style={styles.card}>
          <h3 style={styles.subtitle}>User Details</h3>
          <p><strong>ID:</strong> {user._id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' },
  title: { fontSize: '1.5rem', marginBottom: '1.5rem' },
  subtitle: { fontSize: '1rem', marginBottom: '1rem' },
  card: { border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' },
  input: { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  btn: { padding: '8px 16px', marginRight: '8px', borderRadius: '4px', border: 'none', background: '#4f46e5', color: 'white', cursor: 'pointer' },
  row: { display: 'flex', gap: '8px' },
  message: { color: '#e53e3e', marginTop: '1rem' }
}