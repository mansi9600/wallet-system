import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosInstance'

export default function Dashboard() {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/wallets')
        const wallets = res.data?.data || []
        setWallet(wallets[wallets.length - 1])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="dashboard-shell">
      <div className="dashboard-hero">
        <div>
          <h1 className="dashboard-title">Welcome back, Mansi 👋</h1>
          <p className="dashboard-subtitle">
            Monitor balances, transfer funds, and track transactions in real time.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="balance-card">
          <div className="balance-card__label">Available Balance</div>

          <div className="balance-card__amount">
            {loading
              ? 'Loading...'
              : `₹${Number(wallet?.balance || 0).toLocaleString('en-IN')}`}
          </div>

          <div className="balance-card__meta">
            <span className="wallet-chip wallet-chip--active">ACTIVE</span>
            <span className="wallet-chip">Wallet ID #{wallet?.id}</span>
          </div>

          <div className="balance-card__actions">
            <Link to="/transfer" className="dashboard-btn dashboard-btn--primary">
              Send Money
            </Link>

            <Link to="/history" className="dashboard-btn dashboard-btn--secondary">
              View History
            </Link>
          </div>
        </div>

        <div className="stats-panel">
          <div className="stat-card">
            <span className="stat-card__label">This Month</span>
            <span className="stat-card__value stat-card__value--positive">+12%</span>
          </div>

          <div className="stat-card">
            <span className="stat-card__label">Credits</span>
            <span className="stat-card__value">₹12,500</span>
          </div>

          <div className="stat-card">
            <span className="stat-card__label">Debits</span>
            <span className="stat-card__value">₹6,850</span>
          </div>

          <div className="stat-card">
            <span className="stat-card__label">Net Flow</span>
            <span className="stat-card__value">₹5,650</span>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        <Link to="/transfer" className="feature-card">
          <div className="feature-card__icon">💸</div>
          <h3>Transfer Money</h3>
          <p>Instantly send money to another wallet.</p>
        </Link>

        <Link to="/history" className="feature-card">
          <div className="feature-card__icon">📜</div>
          <h3>Transaction History</h3>
          <p>Review all credits and debits.</p>
        </Link>

        <Link to="/wallet" className="feature-card">
          <div className="feature-card__icon">🔒</div>
          <h3>Security</h3>
          <p>JWT authentication and protected APIs enabled.</p>
        </Link>
      </div>
    </div>
  )
}