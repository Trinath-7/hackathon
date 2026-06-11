import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Sparkles, AlertTriangle, ChevronRight } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import api from '../../services/api'
import toast from 'react-hot-toast'

function ScoreBar({ label, score, color }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{label}</span>
        <span className="font-bold" style={{ color }}>{score}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

export default function ReadinessAssessment() {
  const [form, setForm] = useState({ name: '', description: '', industry: '', target_audience: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.industry || !form.target_audience) return toast.error('Fill all fields')
    setLoading(true); setResult(null)
    try {
      const ideaRes = await api.post('/ideas/', form)
      const id = ideaRes.data.idea.id
      const res = await api.post(`/assessment/${id}`)
      setResult(res.data.assessment)
      toast.success('Assessment complete!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  const SCORES = result ? [
    { label: 'Market Fit', score: result.market_fit_score, color: '#7C3AED' },
    { label: 'Product', score: result.product_readiness_score, color: '#06B6D4' },
    { label: 'Team', score: result.team_readiness_score, color: '#10B981' },
    { label: 'Funding', score: result.funding_readiness_score, color: '#F59E0B' },
    { label: 'Scalability', score: result.scalability_score, color: '#EF4444' },
  ] : []

  const radarData = SCORES.map(s => ({ subject: s.label, score: s.score }))

  const verdictStyle = {
    'Investment Ready': { color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
    'Growth Ready': { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)' },
    'Early Stage': { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
    'Not Ready': { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <CheckSquare size={20} style={{ color: '#8B5CF6' }} />
          </div>
          Startup Readiness Assessment
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI evaluates your startup across 5 critical dimensions</p>
      </div>

      {!result && (
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. LogiTrack AI" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
                <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. Logistics SaaS" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe your startup..." className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Target Audience *</label>
              <input value={form.target_audience} onChange={e => setForm(p => ({ ...p, target_audience: e.target.value }))} placeholder="e.g. Logistics companies in US" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Assessing...</> : <><Sparkles size={16} /> Run Assessment</>}
            </button>
          </form>
        </div>
      )}

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Evaluating your startup readiness...</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Overall Score */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>Overall Readiness Score</p>
                <div className="text-5xl font-black gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>{result.overall_score}%</div>
              </div>
              {result.readiness_verdict && (
                <div className="px-6 py-3 rounded-2xl text-center" style={verdictStyle[result.readiness_verdict] || verdictStyle['Early Stage']}>
                  <p className="text-lg font-black" style={{ color: (verdictStyle[result.readiness_verdict] || verdictStyle['Early Stage']).color, fontFamily: 'Outfit, sans-serif' }}>
                    {result.readiness_verdict}
                  </p>
                </div>
              )}
              <button onClick={() => setResult(null)} className="btn-secondary text-xs py-1.5 px-3">+ New Assessment</button>
            </div>
          </div>

          {/* Radar + Score Bars */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Readiness Radar</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(124, 58, 237, 0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(31, 41, 55, 0.5)', fontSize: 11 }} />
                  <Radar dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: '10px', color: '#1F2937', fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Dimension Scores</h3>
              {SCORES.map(s => <ScoreBar key={s.label} label={s.label} score={s.score} color={s.color} />)}
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: 'market_fit_analysis', label: '🎯 Market Fit', color: '#7C3AED' },
              { key: 'product_readiness_analysis', label: '🛠️ Product Readiness', color: '#06B6D4' },
              { key: 'team_readiness_analysis', label: '👥 Team Readiness', color: '#10B981' },
              { key: 'funding_readiness_analysis', label: '💰 Funding Readiness', color: '#F59E0B' },
            ].map(({ key, label, color }) => result[key] && (
              <div key={key} className="glass-card p-4">
                <h4 className="text-xs font-bold mb-2" style={{ color }}>{label}</h4>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{result[key]}</p>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          {result.top_recommendations && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-400" /> Top Recommendations
              </h3>
              <div className="space-y-2">
                {result.top_recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.06)' }}>
                    <span className={`badge text-xs flex-shrink-0 ${rec.priority === 'High' ? 'badge-red' : rec.priority === 'Medium' ? 'badge-cyan' : 'badge-purple'}`}>
                      {rec.priority}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{rec.action}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{rec.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {result.next_steps && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">🚀 Next Steps</h3>
              <div className="space-y-2">
                {result.next_steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>{i + 1}</div>
                    <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{step}</p>
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
