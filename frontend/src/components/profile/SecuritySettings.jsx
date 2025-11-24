import React, { useEffect, useState } from 'react'
import PasswordStrengthMeter from './PasswordStrengthMeter'
import ActiveSessionsTable from './ActiveSessionsTable'

export default function SecuritySettings({ user, onPasswordChange, on2faToggle, onRevokeSession, onSignOutOthers, onExportData, onDeleteAccount }) {
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [changing, setChanging] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(!!user?.twoFactorEnabled)
  const [sessions, setSessions] = useState([])

  useEffect(() => { setTwoFAEnabled(!!user?.twoFactorEnabled) }, [user])

  useEffect(() => {
    // fetch sessions if api available
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/user/sessions`).then(r=>r.json())
        setSessions(res.sessions || [])
      } catch { setSessions([]) }
    })()
  }, [])

  const submitPwd = async (e) => {
    e.preventDefault()
    if (pwd.next !== pwd.confirm) return alert('Passwords do not match')
    setChanging(true)
    try {
      await onPasswordChange?.({ currentPassword: pwd.current, newPassword: pwd.next })
      setPwd({ current: '', next: '', confirm: '' })
    } finally { setChanging(false) }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* A. Password Management */}
      <form onSubmit={submitPwd} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
        <div className="text-lg font-black text-[#111827]">Password Management</div>
        <div>
          <label className="block text-sm font-medium text-[#111827]">Current Password</label>
          <input type="password" value={pwd.current} onChange={e=>setPwd({...pwd, current:e.target.value})} className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111827]">New Password</label>
          <input type="password" value={pwd.next} onChange={e=>setPwd({...pwd, next:e.target.value})} className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-3 py-2" />
          <div className="mt-3"><PasswordStrengthMeter value={pwd.next} /></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111827]">Confirm New Password</label>
          <input type="password" value={pwd.confirm} onChange={e=>setPwd({...pwd, confirm:e.target.value})} className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-3 py-2" />
        </div>
        <div className="flex justify-end">
          <button disabled={changing} className="px-4 py-2 rounded-xl bg-[#001F3F] text-white font-bold disabled:opacity-60">{changing?'Changing...':'Change Password'}</button>
        </div>
      </form>

      {/* B. Two Factor Auth */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-black text-[#111827]">Two-Factor Authentication</div>
            <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${twoFAEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{twoFAEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
        <div className="pt-2">
          {!twoFAEnabled ? (
            <button onClick={async()=>{await on2faToggle?.(true); setTwoFAEnabled(true)}} className="px-4 py-2 rounded-xl bg-[#001F3F] text-white font-bold">Enable 2FA</button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-600">QR code placeholder</div>
              <div className="rounded-lg border border-gray-200 p-4 text-sm">
                <div className="font-bold mb-1">Backup codes</div>
                <div className="text-gray-600">•••• •••• •••• •••• ••••</div>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>{ alert('Codes revealed in console'); console.log('backup codes: 1234-5678, 9012-3456') }} className="px-4 py-2 rounded-xl border border-[#E5E7EB]">Reveal codes</button>
                <button onClick={async()=>{await on2faToggle?.(false); setTwoFAEnabled(false)}} className="px-4 py-2 rounded-xl border border-red-200 text-red-600">Disable 2FA</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* C. Active Sessions */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-black text-[#111827]">Active Sessions</div>
          <button onClick={onSignOutOthers} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 font-bold">Sign Out All Other Sessions</button>
        </div>
        <ActiveSessionsTable sessions={sessions} currentId={sessions[0]?.id} onRevoke={onRevokeSession} />
      </div>

      {/* D. Data & Privacy */}
      <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
          <div className="text-lg font-black text-[#111827]">Download My Data</div>
          <div className="text-sm text-gray-600 mt-1">Request a copy of all your analysis data</div>
          <div className="mt-3"><button onClick={onExportData} className="px-4 py-2 rounded-xl bg-[#001F3F] text-white font-bold">Request Download</button></div>
        </div>
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
          <div className="text-lg font-black text-[#111827]">Delete Account</div>
          <div className="text-sm text-red-600 mt-1">This action cannot be undone</div>
          <div className="mt-3"><button onClick={()=>{ if (confirm('Are you sure you want to delete your account?')) onDeleteAccount?.() }} className="px-4 py-2 rounded-xl border border-red-300 text-red-600 font-bold">Delete My Account</button></div>
        </div>
      </div>
    </div>
  )
}
