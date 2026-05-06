import { useState } from 'react'
import PM_FRACategory_Search from './pages/PM_FRACategory_Search'
import PM_FRACategory_Create from './pages/PM_FRACategory_Create'
import PM_FRACategory_View   from './pages/PM_FRACategory_View'
import PM_FRACategory_Update from './pages/PM_FRACategory_Update'

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

      {page === 'search' && <PM_FRACategory_Search onNavigate={navigate} />}
      {page === 'create' && <PM_FRACategory_Create onNavigate={navigate} />}
      {page === 'view'   && <PM_FRACategory_View   categoryId={selectedId} onNavigate={navigate} />}
      {page === 'update' && <PM_FRACategory_Update categoryId={selectedId} onNavigate={navigate} />}
    </div>
  )
}
