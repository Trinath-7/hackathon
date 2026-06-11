import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Sparkles, TrendingUp, Users } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import api from '../../services/api'
import toast from 'react-hot-toast'

const MODEL_TYPES = ['SaaS', 'Subscription', 'Freemium', 'Marketplace', 'Commission', 'Advertising', 'Usage-based', 'One-time']

export default function RevenueModel() {
  const [form, setForm] = useState({ name: '', description: '', industry: '', model_type: 'SaaS' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.industry) return toast.error('Fill all fields')
    setLoading(true); setResult(null)
    try {
      const ideaRes = await api.post('/ideas/', { ...form, target_audience: 'General market' })
      const id = ideaRes.data.idea.id
      const res = await api.post(`/revenue/${id}`, { model_type: form.model_type })
      setResult(res.data.revenue_model)
      toast.success('Revenue model generated!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  const TIER_COLORS = ['#7C3AED', '#06B6D4', '#10B981']

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <DollarSign size={20} style={{ color: '#10B981' }} />
          </div>
          Revenue Model Generator
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI-crafted pricing tiers and revenue forecasts with monthly/yearly projections</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. DataSync Pro" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
              <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. B2B SaaS" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Revenue Model Type</label>
            <div className="flex flex-wrap gap-2">
              {MODEL_TYPES.map(m => (
                <button key={m} type="button" onClick={() => setForm(p => ({ ...p, model_type: m }))}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={form.model_type === m
                    ? { background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.6)', color: '#9F67FF' }
                    : { background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.5)' }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Product Description *</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
              placeholder="Describe what your startup offers..." className="input-field resize-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</> : <><Sparkles size={16} /> Generate Revenue Model</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Modeling your revenue strategy...</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Model Info */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>Recommended Model</p>
                <h2 className="text-2xl font-black gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>{result.recommended_model}</h2>
                <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{result.model_description}</p>
              </div>
              <div className="flex gap-6">
                {[
                  { label: 'CAC', value: `$${result.cac}`, color: '#EF4444' },
                  { label: 'LTV', value: `$${result.ltv}`, color: '#10B981' },
                  { label: 'Churn', value: `${result.churn_rate}%`, color: '#F59E0B' },
                  { label: 'Break-even', value: `M${result.break_even_month}`, color: '#06B6D4' },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className="text-xl font-black" style={{ color: m.color, fontFamily: 'Outfit, sans-serif' }}>{m.value}</div>
                    <div className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="grid md:grid-cols-3 gap-4">
            {(result.pricing_tiers || []).map((tier, i) => (
              <div key={i} className="glass-card p-5 relative" style={i === 1 ? { border: '1px solid rgba(124,58,237,0.4)' } : {}}>
                {i === 1 && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>POPULAR</div>
                )}
                <p className="text-sm font-semibold mb-1" style={{ color: TIER_COLORS[i] }}>{tier.tier}</p>
                <div className="text-3xl font-black text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  ${tier.price}<span className="text-base font-normal" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>/mo</span>
                </div>
                <ul className="space-y-2">
                  {(tier.features || []).map((f, j) => (
                    <li key={j} className="text-xs flex items-center gap-2" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>
                      <span style={{ color: TIER_COLORS[i] }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Monthly Projections */}
          {result.monthly_projections && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-400" /> Monthly Revenue Projection
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={result.monthly_projections}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.08)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(31, 41, 55, 0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(31, 41, 55, 0.6)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: '10px', color: '#1F2937', fontSize: 12 }}
                    formatter={(v, name) => [name === 'revenue' ? `$${v.toLocaleString()}` : v, name]} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#revGrad)" strokeWidth={2.5} name="Revenue ($)" />
                  <Area type="monotone" dataKey="users" stroke="#7C3AED" fill="url(#usersGrad)" strokeWidth={2} name="Users" />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(31, 41, 55, 0.5)' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Yearly Projections */}
          {result.yearly_projections && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">3-Year Revenue Outlook</h3>
              <div className="grid grid-cols-3 gap-4">
                {result.yearly_projections.map((yr, i) => (
                  <div key={i} className="p-4 rounded-xl text-center" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.06)' }}>
                    <p className="text-xs mb-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{yr.year}</p>
                    <p className="text-2xl font-black gradient-text mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      ${(yr.revenue / 1000).toFixed(0)}k
                    </p>
                    <span className="badge badge-green text-xs">{yr.growth} growth</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Assumptions */}
          {result.key_assumptions && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Key Assumptions</h3>
              <div className="flex flex-wrap gap-2">
                {result.key_assumptions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <span className="text-yellow-400 text-xs">ℹ</span>
                    <span className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{a}</span>
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
