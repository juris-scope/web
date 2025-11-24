import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 20000,
})

export const userApi = {
  async getProfile() {
    const { data } = await api.get('/api/user/profile')
    return data
  },
  async updateProfile(payload) {
    const { data } = await api.put('/api/user/profile', payload)
    return data
  },
  async uploadAvatar(file) {
    const form = new FormData()
    form.append('avatar', file)
    const { data } = await api.post('/api/user/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return data
  },
  async changePassword(payload) {
    const { data } = await api.put('/api/user/password', payload)
    return data
  },
  async enable2FA() { const { data } = await api.post('/api/user/2fa/enable'); return data },
  async disable2FA() { const { data } = await api.post('/api/user/2fa/disable'); return data },
  async getSessions() { const { data } = await api.get('/api/user/sessions'); return data },
  async revokeSession(id) { const { data } = await api.delete(`/api/user/sessions/${id}`); return data },
  async signOutOthers() { const { data } = await api.post('/api/user/sessions/signout-others'); return data },
  async updatePreferences(prefs) { const { data } = await api.put('/api/user/preferences', prefs); return data },
  async getStatistics() { const { data } = await api.get('/api/user/statistics'); return data },
  async exportData() { const { data } = await api.get('/api/user/export-data'); return data },
  async deleteAccount() { const { data } = await api.delete('/api/user/account'); return data },
}
