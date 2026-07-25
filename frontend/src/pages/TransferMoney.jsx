import { useState } from 'react'
import api from '../api/axiosInstance'

export default function TransferMoney() {
  const [receiverWalletId, setReceiverWalletId] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [senderWalletId, setSenderWalletId] = useState('')

  async function loadMyWalletId() {
    if (senderWalletId) return senderWalletId
    const { data } = await api.get('/wallet/me')
    setSenderWalletId(data.walletId)
    return data.walletId
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const myWalletId = await loadMyWalletId()
      // Idempotency-Key ensures a retried click / flaky network never double-sends
      const idempotencyKey = crypto.randomUUID()

      const { data } = await api.post(
        '/transfer',
        { senderWalletId: myWalletId, receiverWalletId: receiverWalletId, amount: Number(amount) },
        { headers: { 'Idempotency-Key': idempotencyKey } }
      )
      setResult(data)
      setAmount('')
      setReceiverWalletId('')
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Transfer Money</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Receiver Wallet ID</label>
          <input
            type="text"
            required
            value={receiverWalletId}
            onChange={(e) => setReceiverWalletId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="00000000-0000-0000-0000-000000000000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
          <input
            type="number"
            required
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="0.00"
          />
        </div>

        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        {result && (
          <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            Transfer successful. New balance: ${Number(result.balance).toFixed(2)}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
        >
          {loading ? 'Processing…' : 'Send Transfer'}
        </button>
      </form>
    </div>
  )
}
