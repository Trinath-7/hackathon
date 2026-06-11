import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Edit3, Download, Save } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

const CANVAS_SECTIONS = [
  { key: 'problem', label: 'Problem', color: '#EF4444', desc: 'Top 3 problems you\'re solving', emoji: '🎯' },
  { key: 'solution', label: 'Solution', color: '#10B981', desc: 'Your product/service solution', emoji: '💡' },
  { key: 'unique_value_proposition', label: 'Unique Value Proposition', color: '#7C3AED', desc: 'Single, clear, compelling message', emoji: '⭐', isText: true },
  { key: 'unfair_advantage', label: 'Unfair Advantage', color: '#F59E0B', desc: 'Cannot be easily copied or bought', emoji: '🛡️', isText: true },
  { key: 'customer_segments', label: 'Customer Segments', color: '#06B6D4', desc: 'Target customers', emoji: '👥' },
  { key: 'key_metrics', label: 'Key Metrics', color: '#8B5CF6', desc: 'Numbers that matter', emoji: '📊' },
  { key: 'channels', label: 'Channels', color: '#EC4899', desc: 'Path to customers', emoji: '📢' },
  { key: 'revenue_streams', label: 'Revenue Streams', color: '#10B981', desc: 'How you make money', emoji: '💰' },
]

const canvasColClasses = {
  problem: 'canvas-col-problem',
  solution: 'canvas-col-solution',
  key_metrics: 'canvas-col-metrics',
  unique_value_proposition: 'canvas-col-uvp',
  unfair_advantage: 'canvas-col-advantage',
  channels: 'canvas-col-channels',
  customer_segments: 'canvas-col-segments',
  cost_structure: 'canvas-col-costs',
  revenue_streams: 'canvas-col-revenue',
}

export default function LeanCanvas() {
  const [form, setForm] = useState({ name: '', description: '', industry: '', target_audience: '' })
  const [loading, setLoading] = useState(false)
  const [canvas, setCanvas] = useState(null)
  const [ideaId, setIdeaId] = useState(null)
  const [editing, setEditing] = useState({})
  const [editValues, setEditValues] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.industry || !form.target_audience)
      return toast.error('Fill all fields')
    setLoading(true); setCanvas(null)
    try {
      const ideaRes = await api.post('/ideas/', form)
      const id = ideaRes.data.idea.id; setIdeaId(id)
      const res = await api.post(`/canvas/${id}`)
      setCanvas(res.data.lean_canvas)
      toast.success('Lean Canvas generated!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  const startEdit = (key, val) => {
    setEditing(p => ({ ...p, [key]: true }))
    setEditValues(p => ({ ...p, [key]: Array.isArray(val) ? val.join('\n') : (val || '') }))
  }

  const saveEdit = async (key) => {
    const updated = { ...canvas }
    const section = CANVAS_SECTIONS.find(s => s.key === key)
    if (section?.isText) {
      updated[key] = editValues[key]
    } else {
      updated[key] = editValues[key].split('\n').filter(Boolean)
    }
    setCanvas(updated)
    setEditing(p => ({ ...p, [key]: false }))
    if (ideaId) {
      try { await api.put(`/canvas/${ideaId}`, { [key]: updated[key] }); toast.success('Saved!') }
      catch { toast.error('Save failed') }
    }
  }

  const exportPDF = () => {
    if (!canvas) return
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(18); doc.text('Lean Canvas', 20, 20)
    let y = 35
    CANVAS_SECTIONS.forEach(section => {
      const val = canvas[section.key]
      doc.setFontSize(11); doc.setTextColor(100, 60, 240); doc.text(section.label, 20, y); y += 6
      doc.setFontSize(9); doc.setTextColor(50, 50, 50)
      const text = Array.isArray(val) ? val.join(', ') : (val || '')
      const lines = doc.splitTextToSize(text, 250)
      doc.text(lines, 20, y); y += lines.length * 5 + 5
      if (y > 180) { doc.addPage(); y = 20 }
    })
    doc.save('lean-canvas.pdf')
    toast.success('PDF exported!')
  }

  const renderValue = (section, val) => {
    if (section.isText) return <p className="text-xs leading-relaxed" style={{ color: 'rgba(31, 41, 55, 0.75)' }}>{val}</p>
    return (
      <ul className="space-y-1">
        {(Array.isArray(val) ? val : []).map((item, i) => (
          <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>
            <span style={{ color: section.color }}>▸</span> {item}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
              <FileText size={20} style={{ color: '#7C3AED' }} />
            </div>
            Lean Canvas Generator
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI-generated editable Lean Canvas for your startup</p>
        </div>
        {canvas && <button onClick={exportPDF} className="btn-secondary text-sm"><Download size={15} /> Export PDF</button>}
      </div>

      {/* Form */}
      {!canvas && (
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. EcoDeliver" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
                <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. CleanTech" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe your startup..." className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Target Audience *</label>
              <input value={form.target_audience} onChange={e => setForm(p => ({ ...p, target_audience: e.target.value }))} placeholder="e.g. Urban millennials in metro areas" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</> : <><Sparkles size={16} /> Generate Lean Canvas</>}
            </button>
          </form>
        </div>
      )}

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Building your Lean Canvas...</p>
        </div>
      )}

      {canvas && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Click ✏️ on any section to edit it</p>
            <button onClick={() => { setCanvas(null); setIdeaId(null) }} className="btn-secondary text-xs py-1.5 px-3">+ New Canvas</button>
          </div>
          {/* Canvas Grid */}
          <div className="lean-canvas-grid gap-4">
            {CANVAS_SECTIONS.map(section => {
              const val = canvas[section.key]
              const colClass = canvasColClasses[section.key] || ''
              return (
                <div key={section.key} className={`glass-card p-5 relative group flex flex-col justify-between ${colClass}`}
                  style={{ borderColor: `${section.color}22` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{section.emoji}</span>
                      <h4 className="text-xs font-bold" style={{ color: section.color }}>{section.label}</h4>
                    </div>
                    <button
                      onClick={() => editing[section.key] ? saveEdit(section.key) : startEdit(section.key, val)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/10"
                    >
                      {editing[section.key] ? <Save size={12} style={{ color: '#10B981' }} /> : <Edit3 size={12} style={{ color: 'rgba(31, 41, 55, 0.6)' }} />}
                    </button>
                  </div>
                  {editing[section.key] ? (
                    <textarea
                      value={editValues[section.key]}
                      onChange={e => setEditValues(p => ({ ...p, [section.key]: e.target.value }))}
                      className="input-field text-xs resize-none w-full"
                      rows={4}
                      autoFocus
                    />
                  ) : (
                    <>
                      {renderValue(section, val)}
                      {!val || (Array.isArray(val) && val.length === 0) ? (
                        <p className="text-xs italic" style={{ color: 'rgba(124, 58, 237, 0.12)' }}>Click edit to add...</p>
                      ) : null}
                    </>
                  )}
                  <p className="text-xs mt-2" style={{ color: 'rgba(124, 58, 237, 0.12)' }}>{section.desc}</p>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
