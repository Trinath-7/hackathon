import { useState } from 'react'
import { motion } from 'framer-motion'
import { PresentationIcon, Sparkles, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

const SLIDE_ICONS = ['🚀', '🎯', '💡', '📊', '🛠️', '💰', '📣', '📈', '💸', '👥']

function SlidePreview({ slide, index, title, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-2 rounded-lg transition-all ${isActive ? 'ring-2 ring-purple-500 scale-105' : 'hover:bg-white/5'}`}
    >
      <div className="w-full aspect-video rounded-lg flex flex-col items-center justify-center text-center p-2"
        style={{ background: isActive ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.03)', border: `1px solid ${isActive ? 'rgba(124,58,237,0.4)' : 'rgba(124, 58, 237, 0.08)'}` }}>
        <div className="text-2xl mb-1">{SLIDE_ICONS[index]}</div>
        <p className="text-xs font-semibold text-gray-800">{title}</p>
      </div>
    </div>
  )
}

function renderSlideContent(slideKey, data) {
  if (!data) return <p className="text-gray-400 text-sm">No data</p>
  const entries = Object.entries(data)
  return (
    <div className="space-y-3 text-left">
      {entries.map(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        if (Array.isArray(value)) {
          return (
            <div key={key}>
              <p className="text-xs font-bold mb-1.5" style={{ color: '#9F67FF' }}>{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {value.map((item, i) => (
                  typeof item === 'object'
                    ? <div key={i} className="p-2 rounded-lg text-xs w-full" style={{ background: 'rgba(124, 58, 237, 0.04)' }}>
                        {Object.entries(item).map(([k, v]) => (
                          <span key={k} className="mr-2"><strong style={{ color: '#06B6D4' }}>{k.replace(/_/g,' ')}:</strong> <span className="text-gray-800/70">{v}</span></span>
                        ))}
                      </div>
                    : <span key={i} className="badge badge-purple text-xs">{item}</span>
                ))}
              </div>
            </div>
          )
        }
        return (
          <div key={key}>
            <p className="text-xs font-bold mb-0.5" style={{ color: '#9F67FF' }}>{label}</p>
            <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.75)' }}>{String(value)}</p>
          </div>
        )
      })}
    </div>
  )
}

export default function PitchDeck() {
  const [form, setForm] = useState({ name: '', description: '', industry: '', target_audience: '' })
  const [loading, setLoading] = useState(false)
  const [deck, setDeck] = useState(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const SLIDES = deck ? [
    { key: 'title_slide', title: 'Title' },
    { key: 'problem_slide', title: 'Problem' },
    { key: 'solution_slide', title: 'Solution' },
    { key: 'market_slide', title: 'Market Opportunity' },
    { key: 'product_slide', title: 'Product' },
    { key: 'business_model_slide', title: 'Business Model' },
    { key: 'gtm_slide', title: 'Go-To-Market' },
    { key: 'financials_slide', title: 'Financials' },
    { key: 'funding_ask_slide', title: 'Funding Ask' },
    { key: 'team_slide', title: 'Team' },
  ] : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.industry || !form.target_audience) return toast.error('Fill all fields')
    setLoading(true); setDeck(null)
    try {
      const ideaRes = await api.post('/ideas/', form)
      const id = ideaRes.data.idea.id
      const res = await api.post(`/pitchdeck/${id}`)
      setDeck(res.data.pitch_deck)
      toast.success('Pitch deck generated!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed. Check Gemini API key.')
    } finally { setLoading(false) }
  }

  const exportPDF = () => {
    if (!deck) return
    const doc = new jsPDF({ orientation: 'landscape' })
    SLIDES.forEach((s, i) => {
      if (i > 0) doc.addPage()
      doc.setFontSize(18); doc.text(`${SLIDE_ICONS[i]} ${s.title}`, 20, 25)
      doc.setFontSize(10)
      const content = JSON.stringify(deck[s.key], null, 2)
      const lines = doc.splitTextToSize(content, 240)
      doc.text(lines.slice(0, 20), 20, 40)
    })
    doc.save(`${form.name || 'pitch'}-deck.pdf`)
    toast.success('PDF exported!')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <PresentationIcon size={20} style={{ color: '#8B5CF6' }} />
            </div>
            AI Pitch Deck Creator
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Generate a 10-slide investor-ready pitch deck with AI</p>
        </div>
        {deck && <button onClick={exportPDF} className="btn-secondary text-sm"><Download size={15} /> Export PDF</button>}
      </div>

      {!deck && (
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Startup Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. AgroSense AI" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Industry *</label>
                <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. AgriTech" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                placeholder="Describe your startup idea..." className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Target Audience *</label>
              <input value={form.target_audience} onChange={e => setForm(p => ({ ...p, target_audience: e.target.value }))} placeholder="e.g. Farmers and agribusinesses in Southeast Asia" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Deck...</> : <><Sparkles size={16} /> Generate Pitch Deck</>}
            </button>
          </form>
        </div>
      )}

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-semibold">Building your pitch deck...</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Crafting 10 compelling slides...</p>
        </div>
      )}

      {deck && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-4 gap-4">
          {/* Slide Thumbnails */}
          <div className="glass-card p-3 space-y-2 lg:col-span-1 h-fit">
            <p className="text-xs font-semibold px-1 mb-2" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>SLIDES ({SLIDES.length})</p>
            {SLIDES.map((s, i) => (
              <SlidePreview key={s.key} slide={deck[s.key]} index={i} title={s.title} isActive={activeSlide === i} onClick={() => setActiveSlide(i)} />
            ))}
          </div>

          {/* Active Slide */}
          <div className="glass-card lg:col-span-3 overflow-hidden">
            {/* Slide Header */}
            <div className="p-5" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))', borderBottom: '1px solid rgba(124, 58, 237, 0.08)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{SLIDE_ICONS[activeSlide]}</span>
                  <div>
                    <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Slide {activeSlide + 1} of {SLIDES.length}</p>
                    <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>{SLIDES[activeSlide]?.title}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveSlide(p => Math.max(0, p - 1))} disabled={activeSlide === 0}
                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setActiveSlide(p => Math.min(SLIDES.length - 1, p + 1))} disabled={activeSlide === SLIDES.length - 1}
                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
            {/* Slide Content */}
            <div className="p-6">
              {renderSlideContent(SLIDES[activeSlide]?.key, deck[SLIDES[activeSlide]?.key])}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
