import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import '../styles/dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [balance, setBalance] = useState('0.00')
  const [walletId, setWalletId] = useState(null)
  const [stats, setStats] = useState({ totalSent: '0.00', totalReceived: '0.00', txCount: 0 })
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        if (!user || !user.userId) return;
        // Fetch Wallet Summary which includes totalSent and totalReceived
        const summaryRes = await api.get(`/wallets/user/${user.userId}/summary`)
        const summary = summaryRes.data.data
        setWalletId(summary.wallet.id)
        setBalance(Number(summary.wallet.balance).toFixed(2))

        const txRes = await api.get(`/transactions/${summary.wallet.id}`)
        const txs = txRes.data.data || []
        
        // Simple aggregation for the chart based on last 7 transactions
        const recentTxs = [...txs].reverse().slice(0, 7)
        const mockData = recentTxs.map((tx, idx) => ({
          name: `Tx ${idx + 1}`,
          amount: Number(tx.amount)
        }))

        // If no data, provide an empty flatline
        if (mockData.length === 0) {
          mockData.push({ name: 'Day 1', amount: 0 }, { name: 'Day 2', amount: 0 })
        }

        setStats({
          totalSent: Number(summary.totalSent).toFixed(2),
          totalReceived: Number(summary.totalReceived).toFixed(2),
          txCount: txs.length
        })
        setChartData(mockData)

      } catch (err) {
        console.error("Failed to load dashboard data", err)
      }
    }
    fetchData()
  }, [user])

  return (
    <div className="dashboard-shell">
      <div className="dashboard-hero">
        <div>
          <h1 className="dashboard-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="dashboard-subtitle">Here's what's happening with your money today.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="balance-card">
          <div className="balance-card__label">Available Balance</div>
          <div className="balance-card__amount">₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="balance-card__meta">
            <span className="wallet-chip wallet-chip--active">Active Wallet</span>
            <span className="wallet-chip">ID: #{walletId}</span>
            <span className="wallet-chip">INR</span>
          </div>
          <div className="balance-card__actions">
            <Link to="/deposit" className="dashboard-btn dashboard-btn--primary">
              + Add Money
            </Link>
            <Link to="/transfer" className="dashboard-btn dashboard-btn--secondary">
              Send
            </Link>
            <Link to="/history" className="dashboard-btn dashboard-btn--secondary">
              History
            </Link>
          </div>
        </div>

        <div className="stats-panel">
          <div className="stat-card">
            <div className="stat-card__label">Total Received</div>
            <div className="stat-card__value text-success">+₹{Number(stats.totalReceived).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="stat-card__sub">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Total Sent</div>
            <div className="stat-card__value text-danger">-₹{Number(stats.totalSent).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="stat-card__sub">All time</div>
          </div>
        </div>
      </div>

      {/* Recharts Data Visualization */}
      <div className="card" style={{ marginBottom: '40px' }}>
        <div className="card-header">
          <h2>Recent Activity Flow</h2>
        </div>
        <div style={{ height: '300px', padding: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
              />
              <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}