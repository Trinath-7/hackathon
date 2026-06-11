import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Sparkles, Calendar, Target, Hash } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function MarketingStrategy() {
  const [form, setForm] = useState({ name: '', description: '', industry: '', target_audience: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('seo')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.industry || !form.target_audience) return toast.error('Fill all fields')
    setLoading(true); setResult(null)
    try {
      const ideaRes = await api.post('/ideas/', form)
      const id = ideaRes.data.idea.id
      const res = await api.post(`/marketing/${id}`)
      setResult(res.data.marketing_plan)
      toast.success('Marketing strategy generated!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  const TABS = [
    { id: 'seo', label: '🔍 SEO' },
    { id: 'content', label: '📝 Content' },
    { id: 'social', label: '📱 Social' },
    { id: 'growth', label: '🚀 Growth Hacks' },
    { id: 'calendar', label: '📅 Calendar' },
    { id: 'campaigns', label: '🎯 Campaigns' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)' }}>
            <Megaphone size={20} style={{ color: '#EC4899' }} />
          </div>
          Marketing Strategy Generator
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI-powered full marketing strategy — SEO, content, social media, and growth hacks</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Shopify for Creators" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
              <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. E-Commerce SaaS" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Description *</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="What does your startup do?" className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Target Audience *</label>
            <input value={form.target_audience} onChange={e => setForm(p => ({ ...p, target_audience: e.target.value }))} placeholder="e.g. Small business owners and content creators" className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</> : <><Sparkles size={16} /> Generate Marketing Strategy</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Building your marketing strategy...</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                style={activeTab === tab.id
                  ? { background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.4)', color: '#EC4899' }
                  : { background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.5)' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* SEO Tab */}
          {activeTab === 'seo' && result.seo_plan && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-800">🔍 SEO Strategy</h3>
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#EC4899' }}>Target Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {(result.seo_plan.target_keywords || []).map(kw => (
                    <span key={kw} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', color: '#EC4899' }}>
                      <Hash size={10} /> {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#7C3AED' }}>Content Topics</p>
                <div className="space-y-1.5">
                  {(result.seo_plan.content_topics || []).map((t, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)' }}>
                      <span className="text-purple-400 text-xs">→</span>
                      <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#06B6D4' }}>Technical SEO Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {(result.seo_plan.technical_seo || []).map((a, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(6,182,212,0.06)' }}>
                      <span className="text-cyan-400 text-xs">✓</span>
                      <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && result.content_plan && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-800">📝 Content Plan</h3>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <p className="text-xs font-semibold text-purple-400 mb-1">Cadence</p>
                <p className="text-sm text-gray-800">{result.content_plan.content_cadence}</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#10B981' }}>Blog Topics</p>
                <div className="space-y-1.5">
                  {(result.content_plan.blog_topics || []).map((t, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg text-xs" style={{ background: 'rgba(16,185,129,0.06)', color: 'rgba(31, 41, 55, 0.7)' }}>
                      📄 {t}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#EF4444' }}>Video Ideas</p>
                <div className="space-y-1.5">
                  {(result.content_plan.video_ideas || []).map((v, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.06)', color: 'rgba(31, 41, 55, 0.7)' }}>
                      🎬 {v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && result.social_media_strategy && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">📱 Social Media Strategy</h3>
              <div className="space-y-3">
                {(result.social_media_strategy.platforms || []).map((p, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.06)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: i === 0 ? 'rgba(10,102,194,0.15)' : i === 1 ? 'rgba(29,155,240,0.15)' : 'rgba(225,48,108,0.15)' }}>
                      {i === 0 ? '💼' : i === 1 ? '🐦' : '📸'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{p.platform}</p>
                      <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{p.content_type}</p>
                    </div>
                    <span className="badge badge-cyan">{p.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Hacks Tab */}
          {activeTab === 'growth' && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">🚀 Growth Hacks</h3>
              <div className="space-y-2">
                {(result.growth_hacks || []).map((hack, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: `rgba(${[124, 6, 16, 245, 239][i % 5]},${[58, 182, 185, 158, 68][i % 5]},${[237, 212, 129, 11, 68][i % 5]},0.06)` }}>
                    <span className="text-lg">{['⚡', '🎁', '📊', '🤝', '🔄'][i % 5]}</span>
                    <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.75)' }}>{hack}</p>
                  </div>
                ))}
              </div>
              {result.customer_acquisition_strategy && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(124, 58, 237, 0.06)' }}>
                  <p className="text-xs font-semibold mb-2 text-gray-800">Customer Acquisition</p>
                  <p className="text-xs mb-2" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>
                    Estimated CAC: <strong className="text-amber-600 font-bold">{result.customer_acquisition_strategy.estimated_cac}</strong>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#7C3AED' }}>Paid Channels</p>
                      {(result.customer_acquisition_strategy.paid_channels || []).map(c => <p key={c} className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>→ {c}</p>)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#10B981' }}>Organic Channels</p>
                      {(result.customer_acquisition_strategy.organic_channels || []).map(c => <p key={c} className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>→ {c}</p>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weekly Calendar Tab */}
          {activeTab === 'calendar' && result.weekly_calendar && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-cyan-400" /> Weekly Marketing Calendar
              </h3>
              <div className="space-y-3">
                {result.weekly_calendar.map((day, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-24 flex-shrink-0">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(124,58,237,0.15)', color: '#9F67FF' }}>{day.day}</span>
                    </div>
                    <div className="flex-1 flex flex-wrap gap-2">
                      {(day.tasks || []).map((task, j) => (
                        <div key={j} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.7)' }}>
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && result.campaign_suggestions && (
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target size={16} className="text-pink-400" /> Campaign Suggestions
              </h3>
              <div className="space-y-3">
                {result.campaign_suggestions.map((c, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)' }}>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <h4 className="text-sm font-bold text-gray-800">{c.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-purple">{c.type}</span>
                        <span className="badge badge-green">{c.budget}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>
                      <span>📊 Reach: <strong className="text-gray-800">{c.expected_reach}</strong></span>
                      <span>⏱ Duration: <strong className="text-gray-800">{c.duration}</strong></span>
                    </div>
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
