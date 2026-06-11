import { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Sparkles, CheckCircle, Clock, Zap, Code2, ChevronRight } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const PHASE_COLORS = {
  0: { color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)', label: 'Phase 1 — Foundation' },
  1: { color: '#06B6D4', bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.3)', label: 'Phase 2 — Growth' },
  2: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', label: 'Phase 3 — Scale' },
}

function PhaseCard({ phase, phaseIndex, phaseData }) {
  if (!phaseData) return null
  const style = PHASE_COLORS[phaseIndex]
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 flex items-center gap-3" style={{ background: style.bg, borderBottom: `1px solid ${style.border}` }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: style.color, color: 'white' }}>{phaseIndex + 1}</div>
        <div>
          <h3 className="text-sm font-bold text-gray-800">{phaseData.name}</h3>
          <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{phaseData.goal}</p>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {(phaseData.features || []).map((feat, i) => (
          <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)' }}>
            <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: style.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-xs font-semibold text-gray-800">{feat.feature}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`badge text-xs ${feat.priority === 'Must Have' ? 'badge-red' : feat.priority === 'Should Have' ? 'badge-cyan' : 'badge-purple'}`}>{feat.priority}</span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'rgba(31, 41, 55, 0.5)' }}><Clock size={10} />{feat.effort}</span>
                </div>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{feat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MVPRoadmap() {
  const [form, setForm] = useState({ name: '', description: '', industry: '' })
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.industry) return toast.error('Fill all fields')
    setLoading(true); setRoadmap(null)
    try {
      const ideaRes = await api.post('/ideas/', { ...form, target_audience: 'General market' })
      const id = ideaRes.data.idea.id
      const res = await api.post(`/roadmap/${id}`)
      setRoadmap(res.data.roadmap)
      toast.success('Roadmap generated!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <Map size={20} style={{ color: '#F59E0B' }} />
          </div>
          MVP Roadmap Generator
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI-crafted 3-phase product roadmap with milestones and tech stack</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. LearnSync" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
              <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. EdTech" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>What are you building? *</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
              placeholder="Describe your product vision and core use case..." className="input-field resize-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Building Roadmap...</> : <><Sparkles size={16} /> Generate Roadmap</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Planning your product phases...</p>
        </div>
      )}

      {roadmap && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Timeline visual */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-gray-800 mb-5">12-Month Timeline</h3>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4, #10B981)' }} />
              <div className="grid grid-cols-5 gap-4">
                {(roadmap.milestones || []).map((m, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-2 z-10"
                      style={{ background: `${PHASE_COLORS[Math.min(Math.floor(i / 2), 2)].color}`, border: '2px solid rgba(124, 58, 237, 0.12)' }}>
                      M{m.month}
                    </div>
                    <p className="text-xs text-center leading-tight" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{m.milestone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Phase Cards */}
          <div className="grid lg:grid-cols-3 gap-4">
            {[roadmap.phase1, roadmap.phase2, roadmap.phase3].map((phase, i) => (
              <PhaseCard key={i} phase={i} phaseIndex={i} phaseData={phase} />
            ))}
          </div>

          {/* Tech Stack */}
          {roadmap.tech_stack_suggestions && (
            <div className="glass-card p-5">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Code2 size={16} style={{ color: '#7C3AED' }} /> Recommended Tech Stack
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(roadmap.tech_stack_suggestions).map(([cat, techs]) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold mb-2 capitalize" style={{ color: '#7C3AED' }}>{cat}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(techs || []).map(tech => (
                        <span key={tech} className="badge badge-purple text-xs">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team */}
          {roadmap.team_requirements && (
            <div className="glass-card p-5">
              <h3 className="text-base font-bold text-gray-800 mb-3">Team Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.team_requirements.map(role => (
                  <div key={role} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <CheckCircle size={12} className="text-cyan-400" />
                    <span className="text-xs text-gray-800">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
