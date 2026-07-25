import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [walletRes, historyRes] = await Promise.all([
          api.get('/wallet/balance'),
          api.get('/ledger/history')
        ])
        setWallet(walletRes.data)
        setRecent(historyRes.data.slice(0, 5))
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="text-slate-500 mb-6">Here's what's happening with your wallet today.</p>

      {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-brand-600 to-brand-900 text-white rounded-2xl p-6 shadow-md">
          <p className="text-brand-100 text-sm mb-1">Current Balance</p>
          <p className="text-3xl font-bold">
            {loading ? '…' : `${wallet?.currency} ${Number(wallet?.balance).toFixed(2)}`}
          </p>
          <p className="text-brand-100 text-xs mt-2">Status: {wallet?.status}</p>
        </div>

        <Link to="/transfer" className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:border-brand-300 transition flex flex-col justify-between">
          <p className="text-slate-500 text-sm mb-1">Quick Action</p>
          <p className="text-lg font-semibold text-slate-900">Send Money →</p>
        </Link>

        <Link to="/history" className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:border-brand-300 transition flex flex-col justify-between">
          <p className="text-slate-500 text-sm mb-1">Quick Action</p>
          <p className="text-lg font-semibold text-slate-900">View History →</p>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h2>
        {recent.length === 0 && !loading && <p className="text-slate-400 text-sm">No transactions yet.</p>}
        <ul className="divide-y divide-slate-100">
          {recent.map((entry) => (
            <li key={entry.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">{entry.description}</p>
                <p className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
              <span className={`text-sm font-semibold ${entry.entryType === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'}`}>
                {entry.entryType === 'CREDIT' ? '+' : '-'}${Number(entry.amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
