import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(
          err.response?.data?.message ||
          'Invalid email or password'
      )
    }
  }

  return (
      <div className="auth-screen">
        <div className="auth-card">

          <div className="auth-card__brand">
            WL
          </div>

          <h1>Welcome back</h1>

          <p className="auth-card__subtitle">
            Sign in to your wallet
          </p>

          {error && (
              <div className="alert alert-error">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

          </form>

          <p className="auth-card__footer">
            Don't have an account?{' '}
            <Link to="/register">
              Create one
            </Link>
          </p>

        </div>
      </div>
  )
}