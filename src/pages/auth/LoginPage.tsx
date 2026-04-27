import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUsers } from '../../api/users'
import { login as loginAuth } from '../../api/auth'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { toast } from 'sonner'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    const redirect = user.role === 'HR' ? '/hr/dashboard' : user.role === 'MANAGER' ? '/manager/dashboard' : '/employee/dashboard'
    return <Navigate to={redirect} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) { toast.error('Please enter email and password'); return }
    setLoading(true)
    try {
      const { token } = await loginAuth(email, password)
      
      localStorage.setItem('psi_token', token)
      
      try {
        const users = await getUsers()
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())
        if (!found) { 
          localStorage.removeItem('psi_token')
          toast.error('No matched user context found for that email')
          return 
        }
        
        login(found, token)
        
        const redirect = found.role === 'HR' ? '/hr/dashboard' : found.role === 'MANAGER' ? '/manager/dashboard' : '/employee/dashboard'
        navigate(redirect)
        toast.success(`Welcome back, ${found.fullName}!`)
      } catch (err) {
        localStorage.removeItem('psi_token')
        throw err
      }
    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        toast.error('Invalid credentials')
      } else {
        toast.error('Failed to connect to server. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Orbs to make login even cooler */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 glass shadow-2xl shadow-indigo-500/10 border-white/60 animate-fade-in-up">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_10px_25px_rgba(0,0,0,0.3)] relative">
            <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/20" />
            <span className="text-white font-black text-2xl tracking-tighter relative z-10 drop-shadow-md">AS</span>
          </div>
          <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">Welcome Back</CardTitle>
          <p className="text-slate-500 font-medium mt-2">Sign in to your performance portal</p>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 tracking-widest uppercase ml-1">Email</label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-white/50 backdrop-blur-sm border-slate-200/60 focus:bg-white transition-all shadow-inner h-11"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 tracking-widest uppercase ml-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-white/50 backdrop-blur-sm border-slate-200/60 focus:bg-white transition-all shadow-inner h-11"
              />
            </div>
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold tracking-widest uppercase bg-slate-900 hover:bg-black border border-slate-800 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_35px_-5px_rgba(0,0,0,0.6)] text-white transition-all duration-300 hover:scale-[1.02]" 
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
