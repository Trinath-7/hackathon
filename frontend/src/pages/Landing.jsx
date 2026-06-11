import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Zap, ArrowRight, CheckCircle, Star, BarChart2,
  Lightbulb, DollarSign, Users, Globe, TrendingUp,
  Shield, Rocket, ChevronRight, Play, Sparkles
} from 'lucide-react'

const features = [
  { icon: Lightbulb, title: 'AI Idea Validation', desc: 'Get instant validation scores, feasibility reports, and risk analysis for any startup idea.', color: '#7C3AED' },
  { icon: BarChart2, title: 'Market Research Engine', desc: 'Deep industry analysis, market sizing, SWOT, customer personas in seconds.', color: '#06B6D4' },
  { icon: Users, title: 'Competitor Analysis', desc: 'Discover competitors, compare features, analyze strengths & weaknesses.', color: '#10B981' },
  { icon: DollarSign, title: 'Revenue Model Generator', desc: 'AI-crafted SaaS, subscription, marketplace models with revenue forecasts.', color: '#F59E0B' },
  { icon: Rocket, title: 'MVP Roadmap', desc: '3-phase product roadmap with milestones, tech stack, and team requirements.', color: '#EF4444' },
  { icon: Globe, title: 'Investor Matching', desc: 'Match with 1000+ investors based on industry, stage, and geography.', color: '#8B5CF6' },
]

const testimonials = [
  { name: 'Sarah Chen', role: 'CEO, NovaTech', avatar: 'SC', text: 'StartupOS AI helped us validate our EdTech idea in minutes. We raised $2M seed round within 3 months of using the platform.', rating: 5 },
  { name: 'Marcus Rodriguez', role: 'Co-founder, GreenGrid', avatar: 'MR', text: 'The pitch deck generator and investor matching were game-changers. Our deck went from mediocre to professional-grade.', rating: 5 },
  { name: 'Priya Patel', role: 'Founder, HealthAI', avatar: 'PP', text: 'I ran a full market research analysis that would have cost $15,000 with a consulting firm. StartupOS did it in 90 seconds.', rating: 5 },
]

const pricingPlans = [
  {
    name: 'Starter', price: 0, period: 'Free forever',
    features: ['3 Startup Projects', 'Basic AI Validation', 'Market Research', 'Community Support'],
    cta: 'Get Started Free', highlight: false
  },
  {
    name: 'Growth', price: 49, period: '/month',
    features: ['Unlimited Projects', 'Full AI Suite', 'Pitch Deck Creator', 'Investor Matching', 'PDF Exports', 'Priority Support'],
    cta: 'Start Free Trial', highlight: true
  },
  {
    name: 'Scale', price: 149, period: '/month',
    features: ['Everything in Growth', 'Admin Dashboard', 'Custom AI Prompts', 'API Access', 'White-label Reports', 'Dedicated Manager'],
    cta: 'Contact Sales', highlight: false
  },
]

export default function Landing() {
  const [sandboxIdea, setSandboxIdea] = useState('')
  const [sandboxIndustry, setSandboxIndustry] = useState('SaaS')
  const [sandboxLoading, setSandboxLoading] = useState(false)
  const [sandboxStep, setSandboxStep] = useState(0)
  const [sandboxResult, setSandboxResult] = useState(null)

  const handleSandboxSubmit = (e) => {
    e.preventDefault()
    if (!sandboxIdea.trim()) return
    setSandboxLoading(true)
    setSandboxStep(1)
    setSandboxResult(null)

    setTimeout(() => {
      setSandboxStep(2)
    }, 1000)

    setTimeout(() => {
      setSandboxStep(3)
    }, 2000)

    setTimeout(() => {
      const score = Math.floor(Math.random() * 16) + 78 // 78 to 93%
      const success = score - 8
      let verdict = 'Promising'
      if (score >= 88) verdict = 'Excellent'
      else if (score < 78) verdict = 'Needs Work'

      setSandboxResult({
        score,
        success,
        verdict,
        industry: sandboxIndustry,
        idea: sandboxIdea
      })
      setSandboxLoading(false)
      setSandboxStep(0)
    }, 3200)
  }

  return (
    <div style={{ background: '#FAF8FF', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#1F2937' }}>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(124, 58, 237, 0.12)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>StartupOS AI</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-purple-600 transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Sign In</Link>
          <Link to="/signup" className="btn-primary py-2 px-4 text-sm">Start Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />
          {/* Grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.3)', color: '#9F67FF' }}
          >
            <Sparkles size={14} />
            Powered by Google Gemini AI
            <ChevronRight size={14} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-none"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            From Idea to Investment{' '}
            <span className="block gradient-text">Powered by AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            style={{ color: 'rgba(31, 41, 55, 0.65)', lineHeight: 1.7 }}
          >
            The all-in-one AI startup incubator that transforms your startup idea into a launch-ready business.
            Validate, research, plan, and pitch — all powered by cutting-edge AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup" className="btn-glow text-base">
              <Rocket size={18} />
              Start Building Free
              <ArrowRight size={16} />
            </Link>
            <button className="btn-secondary text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.25)' }}>
                <Play size={12} fill="#7C3AED" className="text-purple-600" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          {/* Interactive AI Sandbox Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="glass-card sandbox-glow max-w-2xl mx-auto mt-16 p-6 md:p-8 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-purple-600 animate-pulse" size={18} />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">AI Sandbox Live Demo</span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">Test Your Startup Concept Instantly</h3>
            <p className="text-xs text-gray-500 mb-6">
              Enter your concept below to run a lightweight, simulated AI readiness scan.
            </p>

            {!sandboxResult && !sandboxLoading && (
              <form onSubmit={handleSandboxSubmit} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="e.g. A marketplace for local artisanal micro-bakeries"
                      value={sandboxIdea}
                      onChange={e => setSandboxIdea(e.target.value)}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={sandboxIndustry}
                      onChange={e => setSandboxIndustry(e.target.value)}
                      className="input-field text-sm cursor-pointer"
                    >
                      <option value="SaaS">SaaS</option>
                      <option value="FinTech">FinTech</option>
                      <option value="EdTech">EdTech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary py-2.5 w-full justify-center text-sm shadow-md">
                  Validate Concept <ArrowRight size={14} />
                </button>
              </form>
            )}

            {sandboxLoading && (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {sandboxStep === 1 && 'Step 1/3: Analyzing startup concept vocabulary...'}
                  {sandboxStep === 2 && 'Step 2/3: Evaluation of market feasibility indicators...'}
                  {sandboxStep === 3 && 'Step 3/3: Running viability score algorithms...'}
                </p>
                <p className="text-xs text-gray-400">Please stand by. Generating preview data...</p>
              </div>
            )}

            {sandboxResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400">Concept Preview Result</p>
                    <p className="text-sm font-bold text-gray-850 mt-0.5 truncate max-w-xs" title={sandboxResult.idea}>
                      "{sandboxResult.idea}"
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-600">{sandboxResult.score}%</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">AI Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">{sandboxResult.success}%</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Success Prob.</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-cyan-600">{sandboxResult.verdict}</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Verdict</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/signup" className="btn-glow text-xs justify-center flex-1 py-2.5">
                    Create Free Account to Unlock Complete Report <Rocket size={14} />
                  </Link>
                  <button
                    onClick={() => { setSandboxResult(null); setSandboxIdea(''); }}
                    className="btn-secondary text-xs py-2.5"
                  >
                    Test Another Concept
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3" style={{ color: '#7C3AED' }}>EVERYTHING YOU NEED</p>
            <h2 className="section-title gradient-text mb-4">The Complete AI Startup Suite</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>
              17 powerful AI modules — from idea validation to investor matching — in one unified platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.color}33` }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6" style={{ background: 'rgba(124, 58, 237, 0.02)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3" style={{ color: '#10B981' }}>FOUNDER STORIES</p>
            <h2 className="section-title gradient-text mb-4">Trusted by Founders Worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3" style={{ color: '#06B6D4' }}>SIMPLE PRICING</p>
            <h2 className="section-title gradient-text mb-4">Start Free, Scale as You Grow</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative glass-card p-8"
                style={plan.highlight ? {
                  border: '1px solid rgba(124, 58, 237, 0.5)',
                  background: 'rgba(124, 58, 237, 0.06)',
                  transform: 'scale(1.03)'
                } : {}}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                    MOST POPULAR
                  </div>
                )}
                <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{plan.period}</span>
                </div>
                <div className="my-6 space-y-3">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle size={15} className="text-green-600 flex-shrink-0" />
                      <span className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/signup"
                  className={`w-full flex justify-center ${plan.highlight ? 'btn-glow' : 'btn-secondary'} text-sm`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-14 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at center, #7C3AED24, transparent 70%)' }} />
            <div className="relative">
              <h2 className="section-title text-gray-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Ready to Build Your <span className="gradient-text">Startup?</span>
              </h2>
              <p className="text-base mb-8" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>
                Join 12,000+ founders who are already using StartupOS AI to build, validate, and fund their startups.
              </p>
              <Link to="/signup" className="btn-glow">
                <Rocket size={18} />
                Start Building for Free
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t" style={{ borderColor: 'rgba(124, 58, 237, 0.12)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>StartupOS AI</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>
            © 2024 StartupOS AI. Empowering founders with artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  )
}
