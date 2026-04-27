import api from './axios'

export const login = async (email: string, password: string): Promise<{ token: string }> => {
  const { data } = await api.post<{ token: string }>('/api/auth/login', { email, password })
  return data
}
