import { useState } from 'react'
import FR_ManageFRA_Search from './pages/FR_ManageFRA_Search'
import FR_ManageFRA_Create from './pages/FR_ManageFRA_Create'
import FR_ManageFRA_View   from './pages/FR_ManageFRA_View'
import FR_ManageFRA_Update from './pages/FR_ManageFRA_Update'

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

      {page === 'search' && <FR_ManageFRA_Search onNavigate={navigate} />}
      {page === 'create' && <FR_ManageFRA_Create onNavigate={navigate} />}
      {page === 'view'   && <FR_ManageFRA_View   fraId={selectedId} onNavigate={navigate} />}
      {page === 'update' && <FR_ManageFRA_Update fraId={selectedId} onNavigate={navigate} />}
    </div>
  )
}
