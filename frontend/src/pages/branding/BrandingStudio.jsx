import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Sparkles, Copy, ExternalLink, Check } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function BrandingStudio() {
  const [form, setForm] = useState({ description: '', industry: '', target_audience: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [copiedIdx, setCopiedIdx] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description || !form.industry || !form.target_audience) return toast.error('Fill all fields')
    setLoading(true); setResult(null)
    try {
      const ideaRes = await api.post('/ideas/', { name: 'Branding', ...form })
      const id = ideaRes.data.idea.id
      const res = await api.post(`/branding/${id}`)
      setResult(res.data.branding)
      toast.success('Brand kit generated!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast.success('Copied!')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)' }}>
            <Palette size={20} style={{ color: '#EC4899' }} />
          </div>
          Branding Studio
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>AI generates your brand identity — names, taglines, colors, logo concepts, and domain suggestions</p>
      </div>

      {!result && (
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
                <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. FinTech" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Target Audience *</label>
                <input value={form.target_audience} onChange={e => setForm(p => ({ ...p, target_audience: e.target.value }))} placeholder="e.g. Young professionals 25-35" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>What does your startup do? *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                placeholder="Describe your product/service and its core value..." className="input-field resize-none" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Brand...</> : <><Sparkles size={16} /> Generate Brand Kit</>}
            </button>
          </form>
        </div>
      )}

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Crafting your brand identity...</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Generating names, colors, logo concepts...</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setResult(null)} className="btn-secondary text-xs py-1.5 px-3">+ New Brand Kit</button>
          </div>

          {/* Startup Name Options */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-gray-800 mb-4">🏷️ Startup Name Options</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {(result.startup_names || []).map((item, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-black gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.name}</h4>
                      <p className="text-xs mt-0.5 italic" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>"{item.tagline}"</p>
                    </div>
                    <button onClick={() => copyText(item.name, `name-${i}`)} className="p-1.5 rounded-lg hover:bg-black/5">
                      {copiedIdx === `name-${i}` ? <Check size={13} className="text-green-400" /> : <Copy size={13} style={{ color: 'rgba(31, 41, 55, 0.6)' }} />}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="badge badge-cyan">{item.domain}</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'rgba(31, 41, 55, 0.65)' }}>{item.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-gray-800 mb-4">🎨 Color Palettes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(result.color_palettes || []).map((palette, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-sm font-semibold text-gray-800 mb-3">{palette.name}</p>
                  <div className="flex gap-2 mb-3">
                    {['primary', 'secondary', 'accent', 'background', 'text'].map(key => (
                      <div key={key} title={`${key}: ${palette[key]}`}
                        className="w-10 h-10 rounded-lg cursor-pointer hover:scale-110 transition-transform"
                        style={{ background: palette[key], border: '2px solid rgba(124, 58, 237, 0.08)' }}
                        onClick={() => copyText(palette[key], `${i}-${key}`)}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['primary', 'secondary', 'accent'].map(key => (
                      <span key={key} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.5)' }}>
                        {palette[key]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Story & Voice */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">📖 Brand Story</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{result.brand_story}</p>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">🎤 Brand Voice</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{result.brand_voice}</p>
              <h4 className="text-xs font-bold text-gray-800 mb-2">Typography</h4>
              <div className="flex gap-2">
                <span className="badge badge-purple">{result.typography?.heading_font} (Headings)</span>
                <span className="badge badge-cyan">{result.typography?.body_font} (Body)</span>
              </div>
            </div>
          </div>

          {/* Logo Concepts */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-gray-800 mb-4">🎨 Logo Concepts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(result.logo_concepts || []).map((logo, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.06)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7C3AED22, #06B6D422)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    {i === 0 ? '◈' : '◉'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{logo.concept}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(31, 41, 55, 0.65)' }}>{logo.description}</p>
                    <span className="badge badge-purple mt-2">{logo.style}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domain & Social */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">🌐 Domain Suggestions</h3>
              <div className="space-y-2">
                {(result.domain_suggestions || []).map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 transition-colors">
                    <span className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{d}</span>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-green text-xs">Available</span>
                      <button onClick={() => copyText(d, `domain-${i}`)} className="p-1 rounded hover:bg-black/5">
                        {copiedIdx === `domain-${i}` ? <Check size={12} className="text-green-400" /> : <Copy size={12} style={{ color: 'rgba(31, 41, 55, 0.6)' }} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">📱 Social Media Handles</h3>
              {result.social_handles && (
                <div className="space-y-2">
                  {Object.entries(result.social_handles).map(([platform, handle]) => (
                    <div key={platform} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(124, 58, 237, 0.04)' }}>
                      <span className="text-xs font-semibold capitalize" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{platform}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-800">{handle}</span>
                        <button onClick={() => copyText(handle, `social-${platform}`)} className="p-1 rounded hover:bg-black/5">
                          {copiedIdx === `social-${platform}` ? <Check size={12} className="text-green-400" /> : <Copy size={12} style={{ color: 'rgba(31, 41, 55, 0.6)' }} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
