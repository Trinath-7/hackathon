import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Sparkles, AlertTriangle, CheckCircle, TrendingUp, ChevronDown } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const INDUSTRIES = ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-Commerce', 'AI/ML', 'CleanTech', 'PropTech', 'FoodTech', 'Blockchain', 'Other']

export default function IdeaValidation() {
  const [form, setForm] = useState({ name: '', description: '', industry: '', target_audience: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [savedIdea, setSavedIdea] = useState(null)
  const [loaderStep, setLoaderStep] = useState(0)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.industry || !form.target_audience)
      return toast.error('Please fill in all fields')
    setLoading(true)
    setResult(null)
    setLoaderStep(1)

    const timer = setInterval(() => {
      setLoaderStep(p => p < 3 ? p + 1 : 3)
    }, 2400)

    try {
      // Create idea first
      const ideaRes = await api.post('/ideas/', form)
      const idea = ideaRes.data.idea
      setSavedIdea(idea)
      // Then validate
      const valRes = await api.post(`/ideas/${idea.id}/validate`)
      setResult(valRes.data.validation)
      toast.success('Validation complete!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Validation failed. Check your Gemini API key.')
    } finally {
      clearInterval(timer)
      setLoading(false)
      setLoaderStep(0)
    }
  }

  const verdictColor = (v) => ({ Excellent: '#10B981', Promising: '#06B6D4', 'Needs Work': '#F59E0B', Risky: '#EF4444' }[v] || '#7C3AED')

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
            <Lightbulb size={20} style={{ color: '#7C3AED' }} />
          </div>
          AI Idea Validation
        </h1>
        <p className="text-sm mt-1 ml-13" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>
          Get instant AI-powered validation scores, risk analysis, and improvement suggestions.
        </p>
      </div>

      {/* Form */}
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. TechVision AI" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
              <select name="industry" value={form.industry} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              placeholder="Describe your startup idea in detail. What problem does it solve? How does it work?"
              className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Target Audience *</label>
            <input name="target_audience" value={form.target_audience} onChange={handleChange}
              placeholder="e.g. SMBs in the US, enterprise software teams, B2C millennial consumers" className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing with AI...</>
            ) : (
              <><Sparkles size={16} /> Validate My Idea</>
            )}
          </button>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="glass-card p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div>
              <h3 className="text-base font-bold text-gray-800">AI Viability Analysis in Progress</h3>
              <p className="text-xs text-gray-500">Gemini AI is parsing and validating your concept metrics.</p>
            </div>
          </div>
          
          <div className="timeline-container">
            <div className="timeline-item">
              <div className={`timeline-marker ${loaderStep > 1 ? 'completed' : loaderStep === 1 ? 'active animate-pulse' : ''}`} />
              <p className={`text-sm font-semibold ${loaderStep === 1 ? 'text-purple-600' : loaderStep > 1 ? 'text-gray-850' : 'text-gray-400'}`}>
                1. Parsing startup concept and industry parameters
              </p>
              <p className="text-xs text-gray-400 mt-1">Extracting industry baseline metrics and positioning vectors.</p>
            </div>

            <div className="timeline-item">
              <div className={`timeline-marker ${loaderStep > 2 ? 'completed' : loaderStep === 2 ? 'active animate-pulse' : ''}`} />
              <p className={`text-sm font-semibold ${loaderStep === 2 ? 'text-purple-600' : loaderStep > 2 ? 'text-gray-850' : 'text-gray-400'}`}>
                2. Sizing market opportunities and customer alignment
              </p>
              <p className="text-xs text-gray-400 mt-1">Searching sector databases for target persona validation.</p>
            </div>

            <div className="timeline-item">
              <div className={`timeline-marker ${loaderStep === 3 ? 'active animate-pulse' : ''}`} />
              <p className={`text-sm font-semibold ${loaderStep === 3 ? 'text-purple-600' : 'text-gray-400'}`}>
                3. Running feasibility algorithms and risk mitigation checks
              </p>
              <p className="text-xs text-gray-400 mt-1">Compiling SWOT metrics, innovation factors, and viability scores.</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Verdict Banner */}
          <div className="glass-card p-6 flex items-center justify-between flex-wrap gap-4"
            style={{ borderColor: `${verdictColor(result.verdict)}44` }}>
            <div>
              <p className="text-sm mb-1" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>AI Verdict</p>
              <h2 className="text-2xl font-black" style={{ color: verdictColor(result.verdict), fontFamily: 'Outfit, sans-serif' }}>
                {result.verdict}
              </h2>
            </div>
            <div className="flex gap-6">
              {[
                { label: 'Validation Score', value: result.validation_score, color: '#7C3AED' },
                { label: 'Success Probability', value: result.success_probability, color: '#10B981' },
                { label: 'Market Fit', value: result.market_fit, color: '#06B6D4' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black" style={{ color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.value}%</div>
                  <div className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{s.label}</div>
                  <div className="progress-bar mt-1 w-20">
                    <div className="progress-fill" style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Columns */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Feasibility */}
            <div className="glass-card p-5 md:col-span-2">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-cyan-400" /> Feasibility Report
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{result.feasibility_report}</p>
            </div>
            {/* Scores */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Scores</h3>
              <div className="space-y-3">
                {[
                  { label: 'Innovation', value: result.innovation_score, color: '#7C3AED' },
                  { label: 'Competition', value: result.competition_level === 'Low' ? 80 : result.competition_level === 'Medium' ? 55 : 30, color: '#F59E0B' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{s.label}</span>
                      <span style={{ color: s.color }}>{s.value}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${s.value}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Risks */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-yellow-400" /> Risk Analysis
              </h3>
              <div className="space-y-3">
                {(result.risk_analysis || []).map((r, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.06)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-800">{r.risk}</span>
                      <span className={`badge ${r.severity === 'High' ? 'badge-red' : r.severity === 'Medium' ? 'badge-cyan' : 'badge-green'}`}>{r.severity}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{r.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400" /> Improvement Suggestions
              </h3>
              <div className="space-y-2">
                {(result.improvement_suggestions || []).map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(124,58,237,0.2)', color: '#9F67FF' }}>{i + 1}</span>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: '#10B981' }}>✅ Strengths</h3>
              {(result.strengths || []).map((s, i) => <p key={i} className="text-xs mb-2 flex items-start gap-2" style={{ color: 'rgba(31, 41, 55, 0.7)' }}><span className="text-green-400">→</span>{s}</p>)}
            </div>
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: '#EF4444' }}>⚠️ Weaknesses</h3>
              {(result.weaknesses || []).map((w, i) => <p key={i} className="text-xs mb-2 flex items-start gap-2" style={{ color: 'rgba(31, 41, 55, 0.7)' }}><span className="text-red-400">→</span>{w}</p>)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
