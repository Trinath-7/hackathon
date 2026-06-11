import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, ArrowUp } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import api from '../../services/api'
import toast from 'react-hot-toast'

const INDUSTRIES = ['AI/ML', 'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'Web3', 'SaaS', 'E-Commerce', 'SpaceTech', 'BioTech', 'AgriTech', 'Cybersecurity']
const COLORS = ['#7C3AED', '#06B6D4', '#10B981']

export default function TrendPrediction() {
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTrend, setActiveTrend] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!industry) return toast.error('Select an industry')
    setLoading(true); setResult(null)
    try {
      const res = await api.post('/trends/', { industry })
      setResult(res.data.trends)
      toast.success('Trend analysis complete!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  const horizonBadge = (h) => ({
    '0-1 years': 'badge-green',
    '1-3 years': 'badge-cyan',
    '3-5 years': 'badge-purple',
  }[h] || 'badge-purple')

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <TrendingUp size={20} style={{ color: '#10B981' }} />
          </div>
          Trend Prediction Engine
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI-powered market trend analysis and future opportunity scoring</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Select Industry *</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map(ind => (
                <button key={ind} type="button" onClick={() => setIndustry(ind)}
                  className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={industry === ind
                    ? { background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.5)', color: '#10B981' }
                    : { background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.5)' }}>
                  {ind}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading || !industry} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</> : <><Sparkles size={16} /> Predict Trends</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Scanning emerging trends in {industry}...</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Outlook */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <h3 className="text-base font-bold text-gray-800">Industry Outlook — {industry}</h3>
              <span className={`badge ${result.disruption_risk === 'High' ? 'badge-red' : result.disruption_risk === 'Medium' ? 'badge-cyan' : 'badge-green'}`}>
                Disruption Risk: {result.disruption_risk}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{result.industry_outlook}</p>
          </div>

          {/* Trend Selector */}
          <div className="flex gap-3">
            {(result.emerging_trends || []).map((trend, i) => (
              <button key={i} onClick={() => setActiveTrend(i)}
                className="flex-1 p-3 rounded-xl text-left transition-all"
                style={activeTrend === i
                  ? { background: `${COLORS[i]}18`, border: `1px solid ${COLORS[i]}55` }
                  : { background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)' }}>
                <p className="text-xs font-bold text-gray-800 truncate">{trend.trend}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp size={10} style={{ color: COLORS[i] }} />
                  <span className="text-xs" style={{ color: COLORS[i] }}>{trend.opportunity_score}%</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Trend Detail */}
          {result.emerging_trends?.[activeTrend] && (() => {
            const trend = result.emerging_trends[activeTrend]
            return (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-800">{trend.trend}</h3>
                    <span className={`badge ${horizonBadge(trend.time_horizon)}`}>{trend.time_horizon}</span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{trend.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'rgba(31, 41, 55, 0.5)' }}>Opportunity Score</span>
                      <span className="font-bold" style={{ color: COLORS[activeTrend] }}>{trend.opportunity_score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${trend.opportunity_score}%`, background: COLORS[activeTrend] }} />
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <span style={{ color: 'rgba(31, 41, 55, 0.5)' }}>Market Size</span>
                      <span className="text-gray-800 font-semibold">{trend.market_size}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>Key Players</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(trend.key_players || []).map(p => <span key={p} className="badge badge-purple text-xs">{p}</span>)}
                    </div>
                  </div>
                </div>

                {/* Growth Chart */}
                {trend.growth_data && (
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Growth Trajectory</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={trend.growth_data}>
                        <defs>
                          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS[activeTrend]} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={COLORS[activeTrend]} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.08)" />
                        <XAxis dataKey="year" tick={{ fill: 'rgba(31, 41, 55, 0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'rgba(31, 41, 55, 0.6)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: '10px', color: '#1F2937', fontSize: 12 }} />
                        <Area type="monotone" dataKey="score" stroke={COLORS[activeTrend]} fill="url(#trendGrad)" strokeWidth={2.5} name="Trend Score" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Best Opportunities */}
          {result.best_opportunities && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">🚀 Best Opportunities Right Now</h3>
              <div className="space-y-2">
                {result.best_opportunities.map((opp, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981' }}>{i + 1}</div>
                    <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.75)' }}>{opp}</p>
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
