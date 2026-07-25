import { useEffect, useState } from 'react'
import api from '../api/axiosInstance'

export default function WalletPage() {
  const [wallet, setWallet] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/wallet/me')
      .then((res) => setWallet(res.data))
      .catch(() => setError('Failed to load wallet'))
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Wallet</h1>

      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</div>}

      {wallet && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-4">
          <Row label="Wallet ID" value={wallet.walletId} mono />
          <Row label="Balance" value={`${wallet.currency} ${Number(wallet.balance).toFixed(2)}`} highlight />
          <Row label="Currency" value={wallet.currency} />
          <Row label="Status" value={wallet.status} badge />
        </div>
      )}
    </div>
  )
}

function Row({ label, value, mono, highlight, badge }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      {badge ? (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">{value}</span>
      ) : (
        <span className={`${mono ? 'font-mono text-xs' : 'text-sm'} ${highlight ? 'text-xl font-bold text-brand-700' : 'text-slate-800'}`}>
          {value}
        </span>
      )}
    </div>
  )
}
