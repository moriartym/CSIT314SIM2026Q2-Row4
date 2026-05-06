function ProgressBar({ totalRaised = 0, targetAmount = 0 }) {
  const pct = targetAmount > 0 ? Math.min(100, (totalRaised / targetAmount) * 100) : 0
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
        <span style={{ color: 'var(--ua-muted)' }}>Raised</span>
        <span style={{ color: 'var(--ua-accent)', fontWeight: 600 }}>
          ${totalRaised.toLocaleString()} / ${targetAmount.toLocaleString()}
        </span>
      </div>
      <div style={{ background: 'var(--ua-border)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: '999px', background: 'var(--ua-accent)', width: `${pct}%`, transition: 'width 0.4s ease' }} />
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--ua-muted)', marginTop: '3px' }}>{pct.toFixed(1)}% funded</p>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div style={{ padding: '10px', background: 'var(--ua-bg)', borderRadius: '6px', border: '1px solid var(--ua-border)' }}>
      <p className="ua-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>{label}</p>
      <p style={{ color: 'var(--ua-accent)', fontWeight: 600, fontSize: '13px' }}>{value}</p>
    </div>
  )
}

export default function Donee_DonationHistory_View({ donation, onBack }) {
  if (!donation) return null

  const fra     = donation.fra
  const catName = fra?.category?.name ?? fra?.category ?? '-'

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <span className="ua-card-title">Donation Details</span>
        <button className="ua-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={onBack}>← Back</button>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <p className="ua-muted" style={{ fontSize: '0.72rem' }}>Donation ID: {donation._id}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          <div className="ua-avatar" style={{ width: 42, height: 42, fontSize: 14 }}>
            {fra?.title?.slice(0, 2).toUpperCase() || 'NA'}
          </div>
          <div>
            <p className="ua-row-name" style={{ fontSize: '1rem' }}>{fra?.title || 'Unknown Campaign'}</p>
            <span style={{ fontSize: '13px', color: 'var(--ua-accent)', fontWeight: 600 }}>
              ${donation.amount?.toLocaleString()} donated
            </span>
          </div>
        </div>
      </div>

      <div className="ua-divider" />

      <p className="ua-card-title" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Donation Record</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
        <StatBox label="AMOUNT DONATED" value={`$${donation.amount?.toLocaleString()}`} />
        <StatBox label="DATE"           value={new Date(donation.donatedAt).toLocaleDateString()} />
        <StatBox label="CATEGORY"       value={catName} />
        <StatBox label="CAMPAIGN STATUS" value={fra?.status || '-'} />
      </div>

      <p className="ua-card-title" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Campaign Details</p>

      {fra?.description && (
        <div className="ua-field">
          <label className="ua-label">Description</label>
          <textarea className="ua-input" value={fra.description} disabled style={{ opacity: 0.75, cursor: 'default', resize: 'none' }} rows={3} readOnly />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <StatBox label="TARGET AMOUNT" value={`$${fra?.targetAmount?.toLocaleString() || '-'}`} />
        <StatBox label="TOTAL RAISED"  value={`$${(fra?.totalRaised ?? 0).toLocaleString()}`} />
      </div>

      <ProgressBar totalRaised={fra?.totalRaised ?? 0} targetAmount={fra?.targetAmount ?? 0} />
    </div>
  )
}
