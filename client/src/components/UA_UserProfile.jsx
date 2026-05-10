import { useState } from 'react'
import SearchUserProfile from './pages/UA_UserProfile_Search'
import CreateUserProfile from './pages/UA_UserProfile_Create'
import ViewUserProfile  from './pages/UA_UserProfile_View'
import UpdateUserProfile from './pages/UA_UserProfile_Update'

export default function UserProfile() {
  const [page, setPage]           = useState('search')
  const [selectedId, setSelectedId] = useState(null)

  const navigate = (newPage, id = null) => {
    setPage(newPage)
    setSelectedId(id)
  }

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">User Profiles</h2>
        <p className="ua-subtitle">Manage roles available on the platform</p>
      </div>

      {page === 'search' && <SearchUserProfile onNavigate={navigate} />}
      {page === 'create' && <CreateUserProfile onNavigate={navigate} />}
      {page === 'view'   && <ViewUserProfile  profileId={selectedId} onNavigate={navigate} />}
      {page === 'update' && <UpdateUserProfile profileId={selectedId} onNavigate={navigate} />}
    </div>
  )
}
