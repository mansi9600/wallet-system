import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

export default function DepositMoney() {
  const [amount, setAmount] = useState('')
  const [provider, setProvider] = useState('Razorpay')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleDeposit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (Number(amount) <= 0) {
      setError('Amount must be greater than zero')
      return
    }

    setLoading(true)

    try {
      // 1. Get Wallet ID
      const balRes = await api.get(`/wallets/user/${user.userId}`)
      const walletId = balRes.data.data.id

      // 2. Simulate Payment Gateway UI Delay (like redirecting to Razorpay checkout)
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 3. Complete the deposit
      const txId = `txn_${Math.random().toString(36).substr(2, 9)}`
      await api.post(`/wallets/${walletId}/deposit`, {
        amount: Number(amount),
        provider: provider,
        externalTransactionId: txId
      })

      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Deposit failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ color: 'var(--success)', fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <h2>Payment Successful!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your funds have been deposited.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '16px' }}>Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="card" style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div className="card-header">
        <h2>Add Money to Wallet</h2>
        <p className="dashboard-subtitle">Load funds using your preferred payment method.</p>
      </div>

      <form onSubmit={handleDeposit} style={{ padding: '24px' }}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label className="form-label">Amount (INR)</label>
          <div className="input-with-icon">
            <span className="input-icon">₹</span>
            <input 
              type="number"
              className="form-control" 
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min="1"
              step="0.01"
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label className="form-label">Payment Gateway (Mock)</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ flex: 1, border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', cursor: 'pointer', background: provider === 'Razorpay' ? 'var(--bg-secondary)' : 'transparent' }}>
              <input 
                type="radio" 
                name="provider" 
                value="Razorpay" 
                checked={provider === 'Razorpay'}
                onChange={(e) => setProvider(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              <strong>Razorpay</strong>
            </label>
            <label style={{ flex: 1, border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', cursor: 'pointer', background: provider === 'Stripe' ? 'var(--bg-secondary)' : 'transparent' }}>
              <input 
                type="radio" 
                name="provider" 
                value="Stripe" 
                checked={provider === 'Stripe'}
                onChange={(e) => setProvider(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              <strong>Stripe</strong>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '24px' }}
          disabled={loading}
        >
          {loading ? 'Processing Payment...' : `Pay ₹${amount || '0.00'}`}
        </button>
      </form>
    </div>
  )
}
