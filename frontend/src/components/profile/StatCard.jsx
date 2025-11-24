import React from 'react'

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'text-[#001F3F]' }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-[#6B7280] font-medium">{title}</div>
          <div className={`mt-1 text-3xl font-black ${color}`}>{value}</div>
          {subtitle && <div className="mt-1 text-xs text-[#10B981] font-bold">{subtitle}</div>}
        </div>
        {Icon && <Icon className="text-[#6B7280]" size={24} />}
      </div>
    </div>
  )
}
