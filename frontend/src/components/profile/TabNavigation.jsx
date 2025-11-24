import React from 'react'

export default function TabNavigation({ tabs, active, onChange }) {
  return (
    <div className="px-6 sm:px-8 border-t border-[#E5E7EB]">
      <div className="flex overflow-x-auto no-scrollbar gap-6">
        {tabs.map(t => {
          const Icon = t.icon
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`relative py-4 flex items-center gap-2 font-bold whitespace-nowrap transition-colors ${isActive ? 'text-[#001F3F]' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              <Icon size={18} />
              <span className="text-sm sm:text-base">{t.label}</span>
              {isActive && (
                <span className="absolute -bottom-px left-0 right-0 h-[3px] bg-[#001F3F] rounded-t" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
