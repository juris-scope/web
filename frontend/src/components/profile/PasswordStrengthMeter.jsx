import React from 'react'

export default function PasswordStrengthMeter({ value = '' }) {
  const checks = [
    /.{8,}/.test(value),
    /[A-Z]/.test(value),
    /[0-9]/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['#EF4444', '#F59E0B', '#10B981']
  const barColor = score <= 1 ? colors[0] : score === 2 ? colors[1] : colors[2]
  return (
    <div>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div className="h-2 rounded transition-all" style={{ width: `${(score/4)*100}%`, background: barColor }} />
      </div>
      <ul className="mt-2 text-xs text-gray-600 grid grid-cols-2 gap-y-1">
        <li className={checks[0] ? 'text-green-600' : ''}>At least 8 characters</li>
        <li className={checks[1] ? 'text-green-600' : ''}>One uppercase letter</li>
        <li className={checks[2] ? 'text-green-600' : ''}>One number</li>
        <li className={checks[3] ? 'text-red-600' : ''}>One special character</li>
      </ul>
    </div>
  )
}
