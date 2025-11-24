import User from '../models/User.js'
import path from 'path'
import fs from 'fs'

// Simple helper to get or create a demo user (no auth in this demo)
async function getOrCreateDemoUser() {
  let user = await User.findOne({ email: 'john.doe@lawfirm.com' })
  if (!user) {
    user = await User.create({ fullName: 'Venisha kalola', email: 'john.doe@lawfirm.com', role: 'Professional' })
  }
  return user
}

export async function getProfile(req, res) {
  try {
    const user = await getOrCreateDemoUser()
    res.json(user)
  } catch (e) { res.status(500).json({ error: 'Failed to load profile' }) }
}

export async function updateProfile(req, res) {
  try {
    const user = await getOrCreateDemoUser()
    const updatable = ['fullName','email','phone','jobTitle','organization','barNumber','experience','practiceAreas','specialization','notifications']
    updatable.forEach(k => { if (req.body[k] !== undefined) user[k] = req.body[k] })
    await user.save()
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: 'Failed to update profile' }) }
}

export async function uploadAvatar(req, res) {
  try {
    const user = await getOrCreateDemoUser()
    if (!req.file) return res.status(400).json({ error: 'No file' })
    user.avatar = `/uploads/${path.basename(req.file.path)}`
    await user.save()
    res.json({ ok: true, avatar: user.avatar })
  } catch (e) { res.status(500).json({ error: 'Upload failed' }) }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body || {}
  if (!newPassword) return res.status(400).json({ error: 'Missing new password' })
  // Demo only: not verifying current password nor hashing
  try {
    const user = await getOrCreateDemoUser()
    user.password = newPassword
    await user.save()
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: 'Password change failed' }) }
}

export async function enable2FA(req, res) {
  try { const user = await getOrCreateDemoUser(); user.twoFactorEnabled = true; await user.save(); res.json({ ok:true }) } catch { res.status(500).json({ error: 'Failed' }) }
}
export async function disable2FA(req, res) {
  try { const user = await getOrCreateDemoUser(); user.twoFactorEnabled = false; await user.save(); res.json({ ok:true }) } catch { res.status(500).json({ error: 'Failed' }) }
}

export async function getSessions(req, res) {
  try {
    const user = await getOrCreateDemoUser()
    if (!user.sessions || user.sessions.length === 0) {
      user.sessions = [{ device:'Chrome on macOS', location:'Mumbai, India', ip:'192.168.1.1', lastActive:new Date() }]
      await user.save()
    }
    res.json({ sessions: user.sessions.map(s=>({ id: s._id.toString(), device:s.device, location:s.location, ip:s.ip, lastActive:s.lastActive })) })
  } catch { res.status(500).json({ error: 'Failed' }) }
}

export async function revokeSession(req, res) {
  try {
    const user = await getOrCreateDemoUser()
    user.sessions = user.sessions.filter(s => s._id.toString() !== req.params.id)
    await user.save()
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Failed' }) }
}

export async function signOutOthers(req, res) {
  try {
    const user = await getOrCreateDemoUser()
    user.sessions = user.sessions.slice(0,1)
    await user.save()
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Failed' }) }
}

export async function updatePreferences(req, res) {
  try {
    const user = await getOrCreateDemoUser()
    user.preferences = { ...user.preferences.toObject?.() || {}, ...req.body }
    await user.save()
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Failed' }) }
}

export async function getStatistics(req, res) {
  try {
    const user = await getOrCreateDemoUser()
    const now = Date.now()
    const activity = Array.from({length: 30}, (_,i)=>({ date: new Date(now-(29-i)*86400000).toISOString(), value: Math.round(5+Math.random()*15) }))
    res.json({
      overview: { totalAnalyses: user.statistics?.totalAnalyses || 247, totalClauses: user.statistics?.totalClauses || 3842, highRiskAlerts: user.statistics?.highRiskAlerts || 23, timeSavedHours: 126, trend: '+12% this month' },
      activity,
      clauseTypes: [ { name:'Payment', value:18 }, { name:'Confidentiality', value:22 }, { name:'Liability', value:12 }, { name:'Termination', value:15 }, { name:'Dispute', value:10 } ],
      riskTimeline: Array.from({length:12}, (_,i)=>({ t:`W${i+1}`, high: Math.round(Math.random()*6), moderate: Math.round(Math.random()*9), low: Math.round(Math.random()*14) })),
      history: Array.from({length: 10}, (_,i)=>({ name:`Contract_${i+1}.pdf`, date:new Date(now-i*86400000).toISOString(), score: Math.round(40+Math.random()*60), clauses: Math.round(40+Math.random()*80) }))
    })
  } catch { res.status(500).json({ error: 'Failed' }) }
}

export async function exportData(req, res) {
  res.json({ ok: true, message: 'Your data export request has been received.' })
}

export async function deleteAccount(req, res) {
  try {
    const user = await getOrCreateDemoUser()
    await User.deleteOne({ _id: user._id })
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Failed' }) }
}
