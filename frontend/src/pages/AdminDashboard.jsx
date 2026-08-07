import { useEffect, useState } from 'react'
import api from '../api/axiosInstance'

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, txRes] = await Promise.all([
          api.get('/admin/system-summary'),
          api.get('/admin/all-transactions')
        ])
        setSummary(summaryRes.data)
        setTransactions(txRes.data)
      } catch (err) {
        setError('Failed to load admin data. Are you logged in as an ADMIN?')
      }
    }
    load()
  }, [])

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Admin Ledger Dashboard</h1>
        <p>Financial Auditor view for double-entry accounting verification.</p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '24px' }}>
          {error}
        </div>
      )}

      <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '32px' }}>
        <div className="stat-card">
          <p className="stat-card__label">Total Active Wallets</p>
          <p className="stat-card__value">{summary?.totalWallets ?? '—'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Total System Balance (Liability)</p>
          <p className="stat-card__value">₹{Number(summary?.totalBalance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="stat-card__sub">Sum of all user balances in the system.</p>
        </div>
      </div>

      <div className="history-card">
        <div className="card-header">
          <h2>Immutable Ledger Entries</h2>
        </div>
        <div className="table-wrap">
          <table className="history-table table">
            <thead>
              <tr>
                <th>Entry ID</th>
                <th>Tx Reference</th>
                <th>Type</th>
                <th>Wallet ID</th>
                <th className="align-right">Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td><span className="badge badge-neutral">{tx.id}</span></td>
                  <td><span style={{fontFamily: 'monospace', color: 'var(--text-secondary)'}}>{tx.transactionId.slice(0, 8)}…</span></td>
                  <td>
                    <span className={`status-pill ${tx.entryType === 'CREDIT' ? 'status-pill--success' : 'status-pill--unknown'}`}>
                      {tx.entryType}
                    </span>
                  </td>
                  <td>{tx.wallet?.id ?? '—'}</td>
                  <td className={`align-right amount-cell ${tx.entryType === 'CREDIT' ? 'amount-credit' : 'amount-debit'}`}>
                    {tx.entryType === 'CREDIT' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{color: 'var(--text-secondary)'}}>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {transactions.length === 0 && !error && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    No ledger entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
