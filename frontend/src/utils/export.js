import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'

export function exportCsv(analysis) {
  const { clauses, riskCategories, anomalySeries } = analysis
  let csv = 'Section,Field,Value\n'
  riskCategories.forEach(r => { csv += `Risk Categories,${r.category},${r.score}\n` })
  anomalySeries.forEach(a => { csv += `Anomaly Series,Index ${a.index},${a.anomalyScore}\n` })
  clauses.forEach(c => { csv += `Clauses,${c.predictedType} (${c.id}),Risk ${c.riskScore}; Anom ${c.anomalyScore}\n` })
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'juriscope_analysis.csv')
}

export function exportPdf(analysis) {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text('JuriScope Analysis Report', 14, 18)
  doc.setFontSize(10)
  let y = 26
  doc.text('Risk Categories:', 14, y); y += 6
  analysis.riskCategories.forEach(r => { doc.text(`- ${r.category}: ${r.score} (${r.band})`, 18, y); y += 5 })
  y += 4
  doc.text('Clauses:', 14, y); y += 6
  analysis.clauses.forEach(c => { doc.text(`- ${c.id} ${c.predictedType} Risk:${c.riskScore} Anom:${c.anomalyScore}`, 18, y); y += 5; if (y > 270) { doc.addPage(); y = 20 } })
  doc.save('juriscope_analysis.pdf')
}

export function printAnalysis() {
  window.print()
}
