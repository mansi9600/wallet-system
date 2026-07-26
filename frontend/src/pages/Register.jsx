import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(
          err.response?.data?.message ||
          'Unable to create account. Please try again.'
      )
    }
  }

  return (
      <div className="auth-screen">
        <div className="auth-card">

          <div className="auth-card__brand">
            WL
          </div>

          <h1>Create your wallet</h1>

          <p className="auth-card__subtitle">
            Create your account and start managing your money securely.
          </p>

          {error && (
              <div className="alert alert-error">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="name">
                Full name
              </label>

              <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
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
                  minLength="8"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength="8"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter password again"
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

          </form>

          <p className="auth-card__footer">
            Already have an account?{' '}
            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>
      </div>
  )
}