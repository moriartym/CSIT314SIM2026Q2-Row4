import { useState } from 'react'
import SearchFRACategory from './pages/PM_FRACategory_Search'
import CreateFRACategory from './pages/PM_FRACategory_Create'
import ViewFRACategory  from './pages/PM_FRACategory_View'
import UpdateFRACategory from './pages/PM_FRACategory_Update'

export default function FRACategory() {
  const [page, setPage]           = useState('search')
  const [selectedId, setSelectedId] = useState(null)

  const navigate = (newPage, id = null) => {
    setPage(newPage)
    setSelectedId(id)
  }

  return (
    <div className="ua-container">
      <div className="ua-header">
        <h2 className="ua-title">FRA Categories</h2>
        <p className="ua-subtitle">Manage fundraising activity categories</p>
      </div>

      {page === 'search' && <SearchFRACategory onNavigate={navigate} />}
      {page === 'create' && <CreateFRACategory onNavigate={navigate} />}
      {page === 'view'   && <ViewFRACategory  categoryId={selectedId} onNavigate={navigate} />}
      {page === 'update' && <UpdateFRACategory categoryId={selectedId} onNavigate={navigate} />}
    </div>
  )
}
