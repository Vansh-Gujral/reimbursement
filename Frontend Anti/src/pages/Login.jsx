import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, saveSession, getSession } from '../data/api'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loginAs, setLoginAs]   = useState('default')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    const s = getSession()
    if (s?.role === 'employee') navigate('/app/dashboard', { replace: true })
    if (s?.role === 'finance')  navigate('/finance/dashboard', { replace: true })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const emp = await login(username.trim(), password, loginAs)
      const s = saveSession(emp)
      if (s.role === 'finance') navigate('/finance/dashboard', { replace: true })
      else navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setError('Invalid credentials. Try emp001 / pass123')
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo__mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <div>
            <div className="login-logo__text">ReimburseHQ</div>
            <div className="login-logo__sub">Corporate Portal</div>
          </div>
        </div>

        <div className="login-title">Sign In</div>
        <div className="login-sub">Access your reimbursement workspace</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="form-label" htmlFor="username">Username</label>
            <input id="username" className="form-input" type="text" placeholder="emp001"
              value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" autoFocus />
          </div>
          <div className="form-group mb-4">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" className="form-input" type={showPass ? 'text' : 'password'}
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                autoComplete="current-password" style={{paddingRight:'42px'}} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--color-text-3)',display:'flex',alignItems:'center',padding:'4px'}}>
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <div className="form-group mb-5">
            <label className="form-label" htmlFor="loginAs">Login As (Finance Only)</label>
            <select id="loginAs" className="form-select" value={loginAs} onChange={e => setLoginAs(e.target.value)}>
              <option value="default">Default Role</option>
              <option value="employee">Employee (Submit Requests)</option>
            </select>
          </div>

          {error && <div className="alert alert-error mb-4">{error}</div>}

          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading || !username || !password}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{marginTop:'24px',padding:'14px',background:'var(--color-surface)',borderRadius:'6px',fontSize:'12px',color:'var(--color-text-3)'}}>
          <div style={{fontWeight:'600',marginBottom:'6px',color:'var(--color-text-2)'}}>Demo Accounts</div>
          <div style={{marginBottom:'3px'}}>Employee: <code style={{background:'var(--color-surface-2)',padding:'1px 5px',borderRadius:'3px'}}>emp001</code> / <code style={{background:'var(--color-surface-2)',padding:'1px 5px',borderRadius:'3px'}}>pass123</code></div>
          <div>Finance: <code style={{background:'var(--color-surface-2)',padding:'1px 5px',borderRadius:'3px'}}>finance01</code> / <code style={{background:'var(--color-surface-2)',padding:'1px 5px',borderRadius:'3px'}}>pass123</code></div>
        </div>
      </div>
    </div>
  )
}
