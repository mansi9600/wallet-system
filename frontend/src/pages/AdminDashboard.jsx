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
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <p className="text-slate-500 text-sm mb-1">Total Wallets</p>
          <p className="text-3xl font-bold text-slate-900">{summary?.totalWallets ?? '—'}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <p className="text-slate-500 text-sm mb-1">Total System Balance</p>
          <p className="text-3xl font-bold text-slate-900">${Number(summary?.totalBalance ?? 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">All Transactions</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Transaction ID</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{tx.transactionId.slice(0, 8)}…</td>
                <td className="px-4 py-3">{tx.entryType}</td>
                <td className="px-4 py-3 text-right">${Number(tx.amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
