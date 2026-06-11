import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart2, Sparkles, TrendingUp, Users, Globe,
  AlertCircle, Download, ChevronRight
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import api from '../../services/api'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

const INDUSTRIES = ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-Commerce', 'AI/ML', 'CleanTech', 'PropTech', 'FoodTech', 'Blockchain', 'Other']

function SWOTCard({ title, items, color, bg }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: bg, border: `1px solid ${color}33` }}>
      <h4 className="text-sm font-bold mb-3" style={{ color }}>{title}</h4>
      <ul className="space-y-1.5">
        {(items || []).map((item, i) => (
          <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>
            <span style={{ color }}>▸</span> {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function MarketResearch() {
  const [form, setForm] = useState({ idea_id: '', name: '', description: '', industry: '', target_audience: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [ideaId, setIdeaId] = useState(null)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.industry || !form.target_audience)
      return toast.error('Please fill in all fields')
    setLoading(true)
    setResult(null)
    try {
      // Create idea first, then research
      const ideaRes = await api.post('/ideas/', {
        name: form.name, description: form.description,
        industry: form.industry, target_audience: form.target_audience
      })
      const id = ideaRes.data.idea.id
      setIdeaId(id)
      const res = await api.post(`/market/${id}`)
      setResult(res.data.market_research)
      toast.success('Market research generated!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check your Gemini API key.')
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = () => {
    if (!result) return
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('Market Research Report', 20, 20)
    doc.setFontSize(12)
    doc.text(`Industry Analysis:`, 20, 40)
    doc.setFontSize(10)
    const lines = doc.splitTextToSize(result.industry_analysis || '', 170)
    doc.text(lines, 20, 50)
    doc.setFontSize(12)
    doc.text(`Market Size: ${result.market_size}`, 20, 100)
    doc.text(`TAM: ${result.tam}`, 20, 110)
    doc.text(`SAM: ${result.sam}`, 20, 120)
    doc.text(`SOM: ${result.som}`, 20, 130)
    doc.save('market-research.pdf')
    toast.success('PDF downloaded!')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
              <BarChart2 size={20} style={{ color: '#06B6D4' }} />
            </div>
            Market Research Engine
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI-powered industry analysis, market sizing, SWOT, and customer personas</p>
        </div>
        {result && (
          <button onClick={exportPDF} className="btn-secondary text-sm">
            <Download size={15} /> Export PDF
          </button>
        )}
      </div>

      {/* Form */}
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. HealthTrack AI" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
              <select name="industry" value={form.industry} onChange={handleChange} className="input-field">
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="What does your startup do? What problem does it solve?" className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Target Audience *</label>
            <input name="target_audience" value={form.target_audience} onChange={handleChange}
              placeholder="e.g. Healthcare professionals and patients in North America" className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Researching...</> : <><Sparkles size={16} /> Generate Market Research</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Analyzing market data with Gemini AI...</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>This may take 20-30 seconds</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Market Size Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Market Size', value: result.market_size, color: '#06B6D4', icon: Globe },
              { label: 'TAM', value: result.tam, color: '#7C3AED', icon: TrendingUp },
              { label: 'SAM', value: result.sam, color: '#10B981', icon: BarChart2 },
              { label: 'SOM', value: result.som, color: '#F59E0B', icon: Users },
            ].map(card => (
              <div key={card.label} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <card.icon size={14} style={{ color: card.color }} />
                  <span className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{card.label}</span>
                </div>
                <p className="text-base font-bold text-gray-800">{card.value}</p>
                <p className="text-xs mt-1" style={{ color: card.color }}>
                  {card.label === 'TAM' ? 'Total Addressable' : card.label === 'SAM' ? 'Serviceable' : card.label === 'SOM' ? 'Obtainable' : 'Total Market'}
                </p>
              </div>
            ))}
          </div>

          {/* Market Growth Chart */}
          {result.market_growth_data && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" /> Market Growth Projection
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={result.market_growth_data}>
                  <defs>
                    <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.08)" />
                  <XAxis dataKey="year" tick={{ fill: 'rgba(31, 41, 55, 0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(31, 41, 55, 0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '10px', color: '#1F2937', fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="#06B6D4" fill="url(#mktGrad)" strokeWidth={2.5} name="Market Index" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Industry Analysis */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-gray-800 mb-3">Industry Analysis</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{result.industry_analysis}</p>
          </div>

          {/* SWOT */}
          {result.swot_analysis && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">SWOT Analysis</h3>
              <div className="grid grid-cols-2 gap-3">
                <SWOTCard title="💪 Strengths" items={result.swot_analysis.strengths} color="#10B981" bg="rgba(16,185,129,0.05)" />
                <SWOTCard title="⚠️ Weaknesses" items={result.swot_analysis.weaknesses} color="#EF4444" bg="rgba(239,68,68,0.05)" />
                <SWOTCard title="🚀 Opportunities" items={result.swot_analysis.opportunities} color="#06B6D4" bg="rgba(6,182,212,0.05)" />
                <SWOTCard title="🛡️ Threats" items={result.swot_analysis.threats} color="#F59E0B" bg="rgba(245,158,11,0.05)" />
              </div>
            </div>
          )}

          {/* Market Trends */}
          {result.market_trends && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">Market Trends</h3>
              <div className="space-y-3">
                {result.market_trends.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.06)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                      <TrendingUp size={14} style={{ color: '#7C3AED' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">{t.trend}</p>
                        <span className={`badge ${t.impact === 'High' ? 'badge-green' : t.impact === 'Medium' ? 'badge-cyan' : 'badge-purple'}`}>{t.impact} Impact</span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Personas */}
          {result.customer_personas && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">Customer Personas</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.customer_personas.map((p, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.06)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ background: i % 2 === 0 ? 'linear-gradient(135deg,#7C3AED,#06B6D4)' : 'linear-gradient(135deg,#10B981,#06B6D4)' }}>
                        {p.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{p.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{p.occupation} · {p.age_range}</p>
                      </div>
                      <span className="badge badge-cyan ml-auto">{p.income}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#EF4444' }}>Pain Points</p>
                        {(p.pain_points || []).map((pp, j) => <p key={j} className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.65)' }}>• {pp}</p>)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#10B981' }}>Goals</p>
                        {(p.goals || []).map((g, j) => <p key={j} className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.65)' }}>• {g}</p>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Opportunities */}
          {result.growth_opportunities && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">Growth Opportunities</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.growth_opportunities.map((opp, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <ChevronRight size={14} className="text-green-400 flex-shrink-0" />
                    <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{opp}</p>
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
