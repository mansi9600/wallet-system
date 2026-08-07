import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'
import '../styles/dashboard.css'
export default function TransactionHistory() {
  const [entries, setEntries] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    async function loadTransactions() {
      try {
        if (!user || !user.userId) return;
        const balRes = await api.get(`/wallets/user/${user.userId}`)
        const walletId = balRes.data.data.id

        const res = await api.get(`/transactions/${walletId}`)

        const transactions =
          res.data?.data?.content ||
          res.data?.content ||
          res.data?.data ||
          []

        setEntries(transactions)
      } catch (e) {
        console.error(e)
      }
    }

    loadTransactions()
  }, [user])

  return (
    <div className="dashboard-shell">
      <div className="dashboard-hero">
        <div>
          <h1 className="dashboard-title">Transaction History</h1>
          <p className="dashboard-subtitle">
            Track all wallet credits, debits and transfers.
          </p>
        </div>
      </div>

      <div className="history-card">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>From</th>
              <th>To</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((tx) => (
              <tr key={tx.id}>
                <td>
                  {tx.transactionTime
                    ? new Date(tx.transactionTime).toLocaleString('en-IN')
                    : 'N/A'}
                </td>

                <td>
                  <span className={`status-pill status-pill--${(tx.status || 'unknown').toLowerCase()}`}>
                    {tx.status || 'UNKNOWN'}
                  </span>
                </td>

                <td>#{tx.fromWalletId ?? '-'}</td>
                <td>#{tx.toWalletId ?? '-'}</td>

                <td className="text-right amount-cell">
                  ₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}