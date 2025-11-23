export default function SkeletonBlock({ lines = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_,i)=>(
        <div key={i} className="h-4 bg-gray-200 rounded" />
      ))}
    </div>
  )
}
