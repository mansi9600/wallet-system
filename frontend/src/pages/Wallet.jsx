import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'

export default function Wallet() {
  const [wallet, setWallet] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    async function loadWallet() {
      try {
        if (!user || !user.userId) return;
        const res = await api.get(`/wallets/user/${user.userId}`)
        setWallet(res.data?.data)
      } catch (e) {
        console.error(e)
      }
    }

    loadWallet()
  }, [user])

  return (
    <div className="dashboard-shell">
      <div className="balance-card" style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div className="balance-card__label">Available Balance</div>

        <div className="balance-card__amount">
          ₹{Number(wallet?.balance || 0).toLocaleString('en-IN')}
        </div>

        <div className="balance-card__meta">
          <span className="wallet-chip wallet-chip--active">ACTIVE</span>
          <span className="wallet-chip">Wallet #{wallet?.id}</span>
        </div>

        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="stat-card" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span className="stat-card__label" style={{ color: '#9ca3af' }}>Owner</span>
            <span className="stat-card__value" style={{ color: '#ffffff' }}>{wallet?.ownerName || 'Mansi'}</span>
          </div>

          <div className="stat-card" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <span className="stat-card__label" style={{ color: '#9ca3af' }}>Currency</span>
            <span className="stat-card__value" style={{ color: '#ffffff' }}>INR</span>
          </div>
        </div>
      </div>
    </div>
  )
}