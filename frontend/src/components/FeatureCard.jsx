export default function FeatureCard({ title, subtitle, icon, highlight = false, selectable=false, selected=false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`card text-left p-5 flex items-start gap-4 transition focus:outline-none focus:ring-2 focus:ring-brand-orange ${selectable ? 'cursor-pointer' : ''} ${selected || highlight ? 'border-2 border-brand-orange' : ''}`}
      aria-pressed={selected}
    >
      <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{background:'#F3F4F6'}}>
        {icon}
      </div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </div>
    </button>
  )
}
