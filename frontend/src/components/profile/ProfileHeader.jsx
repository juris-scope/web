import React, { useRef, useState } from 'react'

export default function ProfileHeader({ user, loading, onAvatarChange, onEditProfile }) {
  const fileInputRef = useRef(null)
  const [hover, setHover] = useState(false)
  const initials = user?.fullName ? user.fullName.split(' ').map(n => n[0]).slice(0,2).join('') : 'JD'

  const onPick = () => fileInputRef.current?.click()

  const onFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!/image\/(jpeg|png)/.test(f.type)) return alert('Only JPG/PNG allowed')
    if (f.size > 2 * 1024 * 1024) return alert('Max 2MB image size')
    onAvatarChange?.(f)
  }

  return (
    <div className="p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <div
          className="relative w-28 h-28 rounded-full overflow-hidden shadow ring-2 ring-[#E5E7EB]"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#001F3F] to-[#FF851B] text-white flex items-center justify-center text-3xl font-black">
              {initials}
            </div>
          )}
          <button
            type="button"
            onClick={onPick}
            className={`absolute inset-0 flex items-center justify-center text-sm font-bold text-white bg-black/40 transition-opacity ${hover ? 'opacity-100' : 'opacity-0'}`}
          >
            Change Photo
          </button>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={onFileChange} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#001F3F] truncate">{user?.fullName || 'Venisha kalola'}</h1>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA]">{user?.role || 'Professional User'}</span>
          </div>
          <div className="text-[#6B7280] mt-1">{user?.email || 'john.doe@lawfirm.com'}</div>
          <div className="text-[#9CA3AF] text-sm mt-1">Member since: {user?.memberSince ? new Date(user.memberSince).toLocaleString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024'}</div>
        </div>

        <div className="flex items-center gap-3 self-start">
          <button
            onClick={onEditProfile}
            className="px-4 py-2 rounded-xl font-bold text-white bg-[#001F3F] hover:bg-[#003366] transition"
          >
            Edit Profile
          </button>
          <button
            onClick={onPick}
            className="px-4 py-2 rounded-xl font-bold border border-[#E5E7EB] text-[#111827] hover:bg-gray-50"
          >
            Change Avatar
          </button>
        </div>
      </div>
    </div>
  )
}
