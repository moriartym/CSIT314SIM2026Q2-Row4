import { useState } from 'react'
import SearchUserAccount from './pages/UA_UserAccount_Search'
import CreateUserAccount from './pages/UA_UserAccount_Create'
import ViewUserAccount   from './pages/UA_UserAccount_View'
import UpdateUserAccount from './pages/UA_UserAccount_Update'

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

      {page === 'search' && <SearchUserAccount onNavigate={navigate} />}
      {page === 'create' && <CreateUserAccount onNavigate={navigate} />}
      {page === 'view'   && <ViewUserAccount   accountId={selectedId} onNavigate={navigate} />}
      {page === 'update' && <UpdateUserAccount accountId={selectedId} onNavigate={navigate} />}
    </div>
  )
}
