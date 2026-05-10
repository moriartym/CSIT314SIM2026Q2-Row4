import { useState } from 'react'
import SearchFRA from './pages/FR_ManageFRA_Search'
import CreateFRA from './pages/FR_ManageFRA_Create'
import ViewFRA   from './pages/FR_ManageFRA_View'
import UpdateFRA from './pages/FR_ManageFRA_Update'

export default function FundraisingActivity() {
  const [page, setPage]           = useState('search')
  const [selectedId, setSelectedId] = useState(null)

  const navigate = (newPage, id = null) => {
    setPage(newPage)
    setSelectedId(id)
  }

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">My Fundraising Activities</h2>
        <p className="ua-subtitle">Create and manage your fundraising campaigns</p>
      </div>

      {page === 'search' && <SearchFRA onNavigate={navigate} />}
      {page === 'create' && <CreateFRA onNavigate={navigate} />}
      {page === 'view'   && <ViewFRA   fraId={selectedId} onNavigate={navigate} />}
      {page === 'update' && <UpdateFRA fraId={selectedId} onNavigate={navigate} />}
    </div>
  )
}
