import { useState } from 'react'
import UA_UserAccount_Search from './pages/UA_UserAccount_Search'
import UA_UserAccount_Create from './pages/UA_UserAccount_Create'
import UA_UserAccount_View   from './pages/UA_UserAccount_View'
import UA_UserAccount_Update from './pages/UA_UserAccount_Update'

export default function UserAccount() {
  const [page, setPage]           = useState('search')
  const [selectedId, setSelectedId] = useState(null)

  const navigate = (newPage, id = null) => {
    setPage(newPage)
    setSelectedId(id)
  }

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">User Management</h2>
        <p className="ua-subtitle">Manage user accounts on the platform</p>
      </div>

      {page === 'search' && <UA_UserAccount_Search onNavigate={navigate} />}
      {page === 'create' && <UA_UserAccount_Create onNavigate={navigate} />}
      {page === 'view'   && <UA_UserAccount_View   accountId={selectedId} onNavigate={navigate} />}
      {page === 'update' && <UA_UserAccount_Update accountId={selectedId} onNavigate={navigate} />}
    </div>
  )
}
