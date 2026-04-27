import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User, Role } from '../types'

interface AuthContextType {
  user: User | null
  activeRole: Role | null
  login: (user: User, token?: string) => void
  logout: () => void
  switchRole: (role: Role) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('psi_user')
    return stored ? JSON.parse(stored) : null
  })

  const [activeRole, setActiveRole] = useState<Role | null>(() => {
    const stored = localStorage.getItem('psi_active_role') as Role | null
    if (stored) return stored
    const u = localStorage.getItem('psi_user')
    return u ? (JSON.parse(u) as User).role : null
  })

  const login = (u: User, token?: string) => {
    setUser(u)
    setActiveRole(u.role)
    localStorage.setItem('psi_user', JSON.stringify(u))
    localStorage.setItem('psi_active_role', u.role)
    if (token) localStorage.setItem('psi_token', token)
  }

  const logout = () => {
    setUser(null)
    setActiveRole(null)
    localStorage.removeItem('psi_user')
    localStorage.removeItem('psi_token')
    localStorage.removeItem('psi_active_role')
  }

  const switchRole = (role: Role) => {
    setActiveRole(role)
    localStorage.setItem('psi_active_role', role)
  }

  return (
    <AuthContext.Provider value={{ user, activeRole, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
