import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const [walletRes, historyRes] = await Promise.all([
          api.get('/wallets'),
          api.get('/transactions')
        ])

        const wallets = walletRes.data.data || []
        const walletData =
          wallets.find(
            (w) =>
              w.ownerName &&
              user?.name &&
              w.ownerName.toLowerCase() === user.name.split(' ')[0].toLowerCase()
          ) || wallets[0]

        setWallet(walletData)

        const transactions = historyRes.data.data || historyRes.data || []
        setRecent(Array.isArray(transactions) ? transactions.slice(0, 5) : [])
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [user])

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Monitor balances, transfer funds, and track transactions in real time.</p>
      </div>

      <div className="dashboard-top">

        <div className="balance-card">
          <div className="balance-card__label">Available Balance</div>

          <div className="balance-card__amount">
            ₹{Number(wallet?.balance ?? 0).toLocaleString('en-IN')}
          </div>

          <div className="balance-card__meta">
            <span>{wallet?.status ?? 'ACTIVE'}</span>
            <span>Wallet ID #{wallet?.id ?? '--'}</span>
          </div>

          <div className="modern-actions" style={{marginTop: '24px'}}>
            <Link to="/transfer">Send Money</Link>
            <Link to="/history">View History</Link>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__item">
            <small>This Month</small>
            <strong>+12%</strong>
          </div>

          <div className="stats-card__item">
            <small>Credits</small>
            <strong>₹12,500</strong>
          </div>

          <div className="stats-card__item">
            <small>Debits</small>
            <strong>₹6,850</strong>
          </div>

          <div className="stats-card__item">
            <small>Net Flow</small>
            <strong>₹5,650</strong>
          </div>
        </div>
      </div>

      <div className="action-grid">

        <Link to="/transfer" className="action-card">
          <div className="action-card__icon">💸</div>
          <h3>Transfer Money</h3>
          <p>Instantly send money to another wallet.</p>
        </Link>

        <Link to="/history" className="action-card">
          <div className="action-card__icon">📜</div>
          <h3>Transaction History</h3>
          <p>Review all credits and debits.</p>
        </Link>

        <div className="action-card">
          <div className="action-card__icon">🔒</div>
          <h3>Security</h3>
          <p>JWT authentication and protected APIs enabled.</p>
        </div>
      </div>

      <div className="tx-section">

        <div className="tx-section__header">
          <h2>Recent Transactions</h2>
          <Link to="/history">View all →</Link>
        </div>

        {recent.length === 0 ? (
          <div className="tx-empty">
            <div className="tx-empty__icon">🧾</div>
            <p>No transactions yet</p>
            <span>Your latest wallet activity will appear here.</span>
          </div>
        ) : (
          <ul className="tx-list">
            {recent.map((entry) => (
              <li key={entry.id} className="tx-list__item">

                <div>
                  <div className="tx-list__desc">
                    {entry.description || 'Wallet transaction'}
                  </div>

                  <div className="tx-list__date">
                    {entry.createdAt
                      ? new Date(entry.createdAt).toLocaleDateString()
                      : 'Today'}
                  </div>
                </div>

                <div
                  className={`tx-list__amount ${
                    entry.entryType === 'CREDIT'
                      ? 'tx-list__amount--credit'
                      : 'tx-list__amount--debit'
                  }`}
                >
                  {entry.entryType === 'CREDIT' ? '+' : '-'}₹
                  {Number(entry.amount ?? 0).toLocaleString('en-IN')}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}