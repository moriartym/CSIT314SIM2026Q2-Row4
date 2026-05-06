import { useState } from 'react'
import UA_UserProfile_Search from './pages/UA_UserProfile_Search'
import UA_UserProfile_Create from './pages/UA_UserProfile_Create'
import UA_UserProfile_View   from './pages/UA_UserProfile_View'
import UA_UserProfile_Update from './pages/UA_UserProfile_Update'

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

      {page === 'search' && <UA_UserProfile_Search onNavigate={navigate} />}
      {page === 'create' && <UA_UserProfile_Create onNavigate={navigate} />}
      {page === 'view'   && <UA_UserProfile_View   profileId={selectedId} onNavigate={navigate} />}
      {page === 'update' && <UA_UserProfile_Update profileId={selectedId} onNavigate={navigate} />}
    </div>
  )
}
