import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, Sparkles, ExternalLink, Star } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth']
const GEOS = ['Global', 'North America', 'Europe', 'Asia Pacific', 'India', 'Southeast Asia', 'Latin America']
const AMOUNTS = ['$100K - $500K', '$500K - $2M', '$2M - $10M', '$10M - $50M', '$50M+']

export default function InvestorMatching() {
  const [form, setForm] = useState({ industry: '', stage: 'Seed', geography: 'Global', amount: '$500K - $2M' })
  const [loading, setLoading] = useState(false)
  const [investors, setInvestors] = useState([])
  const [ideaId, setIdeaId] = useState(null)
  const [startupName, setStartupName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.industry || !startupName) return toast.error('Enter your startup name and industry')
    setLoading(true); setInvestors([])
    try {
      const ideaRes = await api.post('/ideas/', {
        name: startupName, description: `${startupName} startup in ${form.industry}`,
        industry: form.industry, target_audience: 'investors'
      })
      const id = ideaRes.data.idea.id; setIdeaId(id)
      const res = await api.post(`/investors/match/${id}`, form)
      setInvestors(res.data.investors || [])
      toast.success(`${res.data.investors?.length || 0} investors matched!`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  const MATCH_COLORS = (score) => score >= 90 ? '#10B981' : score >= 75 ? '#06B6D4' : '#F59E0B'

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
            <UserCheck size={20} style={{ color: '#06B6D4' }} />
          </div>
          Investor Matching Engine
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI matches you with the right investors based on your startup profile</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Name *</label>
              <input value={startupName} onChange={e => setStartupName(e.target.value)} placeholder="e.g. ClearFinance" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
              <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. FinTech" className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Funding Stage</label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(s => (
                <button key={s} type="button" onClick={() => setForm(p => ({ ...p, stage: s }))}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={form.stage === s
                    ? { background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.5)', color: '#06B6D4' }
                    : { background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.5)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Geography</label>
              <select value={form.geography} onChange={e => setForm(p => ({ ...p, geography: e.target.value }))} className="input-field">
                {GEOS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Investment Amount</label>
              <select value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="input-field">
                {AMOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Matching Investors...</> : <><Sparkles size={16} /> Find My Investors</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Scanning investor database...</p>
        </div>
      )}

      {investors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800">{investors.length} investors matched for <span className="gradient-text">{startupName}</span></p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {investors.map((inv, i) => (
              <div key={i} className="glass-card-hover p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #7C3AED22, #06B6D422)', border: '1px solid rgba(124,58,237,0.2)' }}>
                      {inv.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{inv.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.65)' }}>{inv.title} @ {inv.firm}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <div className="text-lg font-black" style={{ color: MATCH_COLORS(inv.match_score), fontFamily: 'Outfit, sans-serif' }}>{inv.match_score}%</div>
                      <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>Match</p>
                    </div>
                    {inv.linkedin && (
                      <a href={inv.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-black/5">
                        <ExternalLink size={13} style={{ color: 'rgba(31, 41, 55, 0.6)' }} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs mb-3" style={{ color: 'rgba(31, 41, 55, 0.75)' }}>{inv.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(inv.industries || []).map(ind => <span key={ind} className="badge badge-purple text-xs">{ind}</span>)}
                  {(inv.stages || []).map(s => <span key={s} className="badge badge-cyan text-xs">{s}</span>)}
                  <span className="badge badge-green text-xs">{inv.geography}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Typical check: <strong className="text-gray-800 font-bold">{inv.typical_check}</strong></span>
                </div>

                {inv.match_reasons && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(124, 58, 237, 0.06)' }}>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: '#10B981' }}>Why it's a match:</p>
                    {inv.match_reasons.slice(0, 2).map((r, j) => (
                      <p key={j} className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>✓ {r}</p>
                    ))}
                  </div>
                )}

                {inv.portfolio_highlights && (
                  <div className="mt-2">
                    <p className="text-xs mb-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Portfolio:</p>
                    <div className="flex flex-wrap gap-1">
                      {inv.portfolio_highlights.map(c => <span key={c} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.5)' }}>{c}</span>)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
