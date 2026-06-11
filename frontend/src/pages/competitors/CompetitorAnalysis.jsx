import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Sparkles, ExternalLink } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip, Legend
} from 'recharts'
import api from '../../services/api'
import toast from 'react-hot-toast'

const INDUSTRIES = ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-Commerce', 'AI/ML', 'CleanTech', 'Other']

export default function CompetitorAnalysis() {
  const [form, setForm] = useState({ name: '', description: '', industry: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.industry) return toast.error('Fill all fields')
    setLoading(true); setResult(null)
    try {
      const ideaRes = await api.post('/ideas/', { ...form, target_audience: 'General market' })
      const id = ideaRes.data.idea.id
      const res = await api.post(`/competitors/${id}`)
      setResult(res.data.competitor_analysis)
      toast.success('Competitor analysis complete!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  const radarData = result?.competitors ? result.competitors.map(c => ({
    subject: c.name,
    product: c.radar_scores?.product || 0,
    marketing: c.radar_scores?.marketing || 0,
    pricing: c.radar_scores?.pricing || 0,
    support: c.radar_scores?.support || 0,
    innovation: c.radar_scores?.innovation || 0,
  })) : []

  const radarChartData = result?.competitors ? [
    { axis: 'Product', ...Object.fromEntries(result.competitors.map(c => [c.name, c.radar_scores?.product || 0])) },
    { axis: 'Marketing', ...Object.fromEntries(result.competitors.map(c => [c.name, c.radar_scores?.marketing || 0])) },
    { axis: 'Pricing', ...Object.fromEntries(result.competitors.map(c => [c.name, c.radar_scores?.pricing || 0])) },
    { axis: 'Support', ...Object.fromEntries(result.competitors.map(c => [c.name, c.radar_scores?.support || 0])) },
    { axis: 'Innovation', ...Object.fromEntries(result.competitors.map(c => [c.name, c.radar_scores?.innovation || 0])) },
  ] : []

  const COLORS = ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <Users size={20} style={{ color: '#10B981' }} />
          </div>
          Competitor Analysis
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI discovers and analyzes your top competitors across multiple dimensions</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Your Startup Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. PayFlow Pro" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
              <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} className="input-field">
                <option value="">Select...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>What does your startup do? *</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
              placeholder="Briefly describe your product/service and target market..." className="input-field resize-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Discovering Competitors...</> : <><Sparkles size={16} /> Analyze Competitors</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Scanning market for competitors...</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Strategy Summary */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-2">🎯 Competitive Advantage</h3>
              <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{result.competitive_advantage}</p>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-2">🚀 Differentiation Strategy</h3>
              <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{result.differentiation_strategy}</p>
            </div>
          </div>

          {/* Radar Chart */}
          {radarChartData.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">Competitor Radar Chart</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="rgba(124, 58, 237, 0.08)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: 'rgba(31, 41, 55, 0.5)', fontSize: 11 }} />
                  {result.competitors.map((c, i) => (
                    <Radar key={c.name} name={c.name} dataKey={c.name}
                      stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.12} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(31, 41, 55, 0.5)' }} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: '10px', color: '#1F2937', fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Competitor Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {(result.competitors || []).map((comp, i) => (
              <div key={i} className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{ background: `${COLORS[i % COLORS.length]}22`, border: `1px solid ${COLORS[i % COLORS.length]}44`, color: COLORS[i % COLORS.length] }}>
                      {comp.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{comp.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{comp.funding_raised} raised</p>
                    </div>
                  </div>
                  {comp.website && (
                    <a href={comp.website} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-black/5 transition-colors">
                      <ExternalLink size={13} style={{ color: 'rgba(31, 41, 55, 0.6)' }} />
                    </a>
                  )}
                </div>
                <p className="text-xs mb-3" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{comp.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Starting at</span>
                  <span className="badge badge-purple">{comp.pricing?.starting_price}</span>
                  <span className="badge badge-cyan">{comp.pricing?.model}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#10B981' }}>Strengths</p>
                    {(comp.strengths || []).map((s, j) => <p key={j} className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>✓ {s}</p>)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#EF4444' }}>Weaknesses</p>
                    {(comp.weaknesses || []).map((w, j) => <p key={j} className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>✗ {w}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="glass-card p-6 overflow-x-auto">
            <h3 className="text-base font-bold text-gray-800 mb-4">Feature Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(124, 58, 237, 0.08)' }}>
                  <th className="text-left pb-3 text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>COMPETITOR</th>
                  <th className="text-center pb-3 text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>PRODUCT</th>
                  <th className="text-center pb-3 text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>MARKETING</th>
                  <th className="text-center pb-3 text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>PRICING</th>
                  <th className="text-center pb-3 text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>INNOVATION</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {(result.competitors || []).map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(124, 58, 237, 0.08)' }}>
                    <td className="py-3 font-medium text-gray-800 text-xs">{c.name}</td>
                    {['product', 'marketing', 'pricing', 'innovation'].map(key => (
                      <td key={key} className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(124, 58, 237, 0.08)' }}>
                            <div className="h-full rounded-full" style={{ width: `${c.radar_scores?.[key] || 0}%`, background: COLORS[i % COLORS.length] }} />
                          </div>
                          <span className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{c.radar_scores?.[key] || 0}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}
