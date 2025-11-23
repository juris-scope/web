export default function DashboardCard({ title, value, icon }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      {icon && (
        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{background:'#F3F4F6'}}>
          {icon}
        </div>
      )}
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  )}
