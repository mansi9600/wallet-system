import { useEffect, useState } from 'react'
import api from '../api/axiosInstance'

export default function TransactionHistory() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await api.get(
          '/transactions?page=0&size=10&sort=id,desc'
        )

        const transactions =
          res.data?.data?.content ||
          res.data?.content ||
          res.data?.data ||
          []

        setEntries(transactions)
      } catch (err) {
        console.error(err)
        setError('Failed to load transaction history')
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Transaction History</h1>

      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</div>}

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-3 text-slate-500">{new Date(entry.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${entry.entryType === 'CREDIT' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {entry.entryType}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{entry.description}</td>
                <td className={`px-4 py-3 text-right font-semibold ${entry.entryType === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {entry.entryType === 'CREDIT' ? '+' : '-'}${Number(entry.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && entries.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">No transactions yet.</p>
        )}
      </div>
    </div>
  )
}
