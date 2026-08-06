import { useState } from 'react'
import api from '../api/axiosInstance'
import '../styles/dashboard.css'
export default function TransferMoney() {
  const [receiverWalletId, setReceiverWalletId] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await api.post(
        '/transactions/transfer',
        {
          senderWalletId: 5,
          receiverWalletId: Number(receiverWalletId),
          amount: Number(amount),
        },
        {
          headers: {
            'Idempotency-Key': crypto.randomUUID(),
          },
        }
      )

      setMessage('Transfer completed successfully!')
      setReceiverWalletId('')
      setAmount('')
    } catch (err) {
      setMessage('Transfer failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="transfer-page">
      <div className="transfer-card">
        <div className="transfer-card__header">
          <div>
            <h1>Send Money</h1>
            <p>Transfer funds securely to another wallet in real time.</p>
          </div>
          <div className="transfer-icon">💸</div>
        </div>

        <form onSubmit={handleSubmit} className="transfer-form">
          <div className="form-group">
            <label>Receiver Wallet ID</label>
            <input
              type="number"
              value={receiverWalletId}
              onChange={(e) => setReceiverWalletId(e.target.value)}
              placeholder="Enter receiver wallet ID"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount (INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing Transfer…' : 'Send Money'}
          </button>
        </form>

        {message && <div className="transfer-message">{message}</div>}
      </div>
    </div>
  )
}