import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-brand-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/dashboard" className="text-lg font-semibold tracking-tight">
        Wallet<span className="text-brand-100">Ledger</span>
      </Link>

      {user && (
        <div className="flex items-center gap-6 text-sm">
          <Link to="/dashboard" className="hover:text-brand-100">Dashboard</Link>
          <Link to="/wallet" className="hover:text-brand-100">Wallet</Link>
          <Link to="/transfer" className="hover:text-brand-100">Transfer</Link>
          <Link to="/history" className="hover:text-brand-100">History</Link>
          {isAdmin && <Link to="/admin" className="hover:text-brand-100">Admin</Link>}
          <span className="text-brand-100">{user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
