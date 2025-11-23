export default function FeatureCard({ title, subtitle, icon, highlight = false }) {
  return (
    <div className={`card p-5 flex items-start gap-4 ${highlight ? 'border-2 border-brand-orange' : ''}`}>
      <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{background:'#F3F4F6'}}>
        {icon}
      </div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </div>
    </div>
  )
}
