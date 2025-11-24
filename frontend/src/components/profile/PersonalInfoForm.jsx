import React, { useEffect, useMemo, useState } from 'react'

const jobTitles = ['Lawyer', 'Legal Analyst', 'Paralegal', 'Other']
const experienceOptions = ['0-2', '3-5', '6-10', '10+']
const practiceAreas = ['Corporate Law','Contract Law','Intellectual Property','Real Estate','Employment Law','Other']

export default function PersonalInfoForm({ user, loading, onSave, onCancel }) {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', jobTitle: '', organization: '',
    barNumber: '', experience: '', practiceAreas: [], specialization: '',
    notifications: { email: true, weeklySummary: true, productUpdates: true, educational: true, marketing: false }
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        jobTitle: user.jobTitle || '',
        organization: user.organization || '',
        barNumber: user.barNumber || '',
        experience: user.experience || '',
        practiceAreas: user.practiceAreas || [],
        specialization: user.specialization || '',
        notifications: user.notifications || form.notifications,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const validate = () => {
    const e = {}
    if (!form.fullName?.trim()) e.fullName = 'Full Name is required'
    if (!form.email?.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSave?.(form)
    } finally {
      setSaving(false)
    }
  }

  const togglePractice = (item) => {
    setForm(f => ({...f, practiceAreas: f.practiceAreas.includes(item) ? f.practiceAreas.filter(p => p!==item) : [...f.practiceAreas, item]}))
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* A. Basic Information */}
      <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
        <div className="text-lg font-black text-[#111827]">Basic Information</div>
        <div>
          <label className="block text-sm font-medium text-[#111827]">Full Name <span className="text-red-500">*</span></label>
          <input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} className={`mt-1 w-full rounded-xl border ${errors.fullName ? 'border-red-400' : 'border-[#E5E7EB]'} focus:outline-none focus:ring-2 focus:ring-[#001F3F] px-3 py-2`} />
          {errors.fullName && <div className="text-xs text-red-600 mt-1">{errors.fullName}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111827]">Email Address <span className="text-red-500">*</span></label>
          <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className={`mt-1 w-full rounded-xl border ${errors.email ? 'border-red-400' : 'border-[#E5E7EB]'} focus:outline-none focus:ring-2 focus:ring-[#001F3F] px-3 py-2`} />
          <div className="text-xs text-green-600 mt-1">Verified</div>
          {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111827]">Phone Number</label>
            <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="mt-1 w-full rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#001F3F] px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827]">Job Title</label>
            <select value={form.jobTitle} onChange={e=>setForm({...form, jobTitle:e.target.value})} className="mt-1 w-full rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#001F3F] px-3 py-2">
              <option value="">Select...</option>
              {jobTitles.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111827]">Organization</label>
            <input value={form.organization} onChange={e=>setForm({...form, organization:e.target.value})} className="mt-1 w-full rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#001F3F] px-3 py-2" />
          </div>
          <div></div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-[#E5E7EB]">Cancel</button>
          <button disabled={saving} className="px-4 py-2 rounded-xl bg-[#001F3F] text-white font-bold disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>

      {/* B. Professional Details */}
      <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
        <div className="text-lg font-black text-[#111827]">Professional Details</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111827]">Bar Association Number</label>
            <input value={form.barNumber} onChange={e=>setForm({...form, barNumber:e.target.value})} className="mt-1 w-full rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#001F3F] px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827]">Years of Experience</label>
            <select value={form.experience} onChange={e=>setForm({...form, experience:e.target.value})} className="mt-1 w-full rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#001F3F] px-3 py-2">
              <option value="">Select...</option>
              {experienceOptions.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">Practice Areas</label>
          <div className="flex flex-wrap gap-2">
            {practiceAreas.map(p => (
              <button type="button" key={p} onClick={() => togglePractice(p)} className={`px-3 py-1.5 rounded-xl border text-sm ${form.practiceAreas.includes(p) ? 'bg-[#001F3F] text-white border-[#001F3F]' : 'border-[#E5E7EB] text-[#111827] hover:bg-gray-50'}`}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111827]">Specialization</label>
          <textarea rows={4} value={form.specialization} onChange={e=>setForm({...form, specialization:e.target.value})} className="mt-1 w-full rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#001F3F] px-3 py-2" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-[#E5E7EB]">Cancel</button>
          <button disabled={saving} className="px-4 py-2 rounded-xl bg-[#001F3F] text-white font-bold disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>

      {/* C. Contact Preferences */}
      <form onSubmit={(e)=>{e.preventDefault(); onSave?.({ notifications: form.notifications })}} className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
        <div className="text-lg font-black text-[#111827]">Contact Preferences</div>
        {[
          ['email','Email notifications for completed analyses'],
          ['weeklySummary','Weekly summary reports'],
          ['productUpdates','Product updates and new features'],
          ['educational','Educational content and tips'],
          ['marketing','Marketing communications'],
        ].map(([key,label]) => (
          <label key={key} className="flex items-center gap-3 text-[#111827]">
            <input type="checkbox" checked={!!form.notifications[key]} onChange={e=>setForm(f=>({...f, notifications:{...f.notifications, [key]: e.target.checked}}))} />
            {label}
          </label>
        ))}
        <div className="flex justify-end">
          <button className="px-4 py-2 rounded-xl bg-[#001F3F] text-white font-bold">Save Preferences</button>
        </div>
      </form>
    </div>
  )
}
