import React from 'react'

export default function ActiveSessionsTable({ sessions = [], currentId, onRevoke }) {
  if (!sessions.length) {
    return (
      <div className="p-6 text-sm text-gray-600">No active sessions found. Your current session will appear here when available.</div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 px-3">Device</th>
            <th className="py-2 px-3">Location</th>
            <th className="py-2 px-3">IP Address</th>
            <th className="py-2 px-3">Last Active</th>
            <th className="py-2 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="border-t border-gray-100">
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.id === currentId ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="font-medium text-gray-800">{s.device}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-gray-600">{s.location}</td>
              <td className="py-3 px-3 text-gray-600">{s.ip}</td>
              <td className="py-3 px-3 text-gray-600">{s.lastActive ? new Date(s.lastActive).toLocaleString() : '—'}</td>
              <td className="py-3 px-3 text-right">
                {s.id !== currentId && (
                  <button onClick={() => onRevoke?.(s.id)} className="text-red-600 font-bold hover:underline">Revoke</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
