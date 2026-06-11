import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, Legend
} from 'recharts'
import {
  Lightbulb, TrendingUp, DollarSign, Rocket, Activity,
  ArrowRight, Plus, BarChart2, Users, Map, Zap
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

// Score Ring Component
function ScoreRing({ score, color, size = 90 }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(124, 58, 237, 0.08)" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 8px ${color}55)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-black text-gray-800">{score}</span>
      </div>
    </div>
  )
}

const marketGrowthData = [
  { month: 'Jan', market: 42, revenue: 18 },
  { month: 'Feb', market: 48, revenue: 25 },
  { month: 'Mar', market: 55, revenue: 31 },
  { month: 'Apr', market: 61, revenue: 40 },
  { month: 'May', market: 70, revenue: 52 },
  { month: 'Jun', market: 78, revenue: 61 },
]

const competitorData = [
  { subject: 'Product', A: 90, B: 70, C: 55 },
  { subject: 'Marketing', A: 75, B: 85, C: 60 },
  { subject: 'Pricing', A: 80, B: 65, C: 75 },
  { subject: 'Support', A: 85, B: 60, C: 70 },
  { subject: 'Innovation', A: 95, B: 50, C: 45 },
]

const revenueData = [
  { month: 'M1', revenue: 2000 }, { month: 'M2', revenue: 4500 },
  { month: 'M3', revenue: 8000 }, { month: 'M4', revenue: 12000 },
  { month: 'M5', revenue: 18000 }, { month: 'M6', revenue: 26000 },
]

const SCORE_WIDGETS = [
  { label: 'Startup Readiness', score: 78, color: '#7C3AED', icon: Rocket },
  { label: 'Health Score', score: 85, color: '#10B981', icon: Activity },
  { label: 'Idea Validation', score: 92, color: '#06B6D4', icon: Lightbulb },
  { label: 'Market Potential', score: 71, color: '#F59E0B', icon: TrendingUp },
  { label: 'Funding Readiness', score: 64, color: '#EF4444', icon: DollarSign },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [ideas, setIdeas] = useState([])
  const [loadingIdeas, setLoadingIdeas] = useState(true)

  useEffect(() => {
    api.get('/ideas/').then(res => setIdeas(res.data.ideas || [])).catch(() => {}).finally(() => setLoadingIdeas(false))
  }, [])

  const quickActions = [
    { label: 'Validate Idea', icon: Lightbulb, path: '/validate', color: '#7C3AED' },
    { label: 'Market Research', icon: BarChart2, path: '/market-research', color: '#06B6D4' },
    { label: 'Find Investors', icon: Users, path: '/investors', color: '#10B981' },
    { label: 'MVP Roadmap', icon: Map, path: '/roadmap', color: '#F59E0B' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>
            Your startup ecosystem is ready. Let's build something great.
          </p>
        </div>
        <Link to="/validate" className="btn-primary text-sm">
          <Plus size={16} /> New Project
        </Link>
      </div>

      {/* Score Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {SCORE_WIDGETS.map((w, i) => (
          <motion.div
            key={w.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card p-5 flex flex-col items-center text-center gap-3"
          >
            <ScoreRing score={w.score} color={w.color} />
            <div>
              <p className="text-xs font-semibold text-gray-700">{w.label}</p>
              <div className="progress-bar mt-2">
                <div className="progress-fill" style={{ width: `${w.score}%` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((a, i) => (
          <motion.div key={a.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }}>
            <Link to={a.path} className="glass-card-hover p-4 flex items-center gap-3 block">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${a.color}18`, border: `1px solid ${a.color}33` }}>
                <a.icon size={18} style={{ color: a.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{a.label}</p>
                <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>AI-powered</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Market Growth Chart */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-600" /> Market Growth Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={marketGrowthData}>
              <defs>
                <linearGradient id="marketGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.08)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(31, 41, 55, 0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(31, 41, 55, 0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '10px', color: '#1F2937', fontSize: 12 }} />
              <Area type="monotone" dataKey="market" stroke="#7C3AED" fill="url(#marketGrad)" strokeWidth={2} name="Market Score" />
              <Area type="monotone" dataKey="revenue" stroke="#06B6D4" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Competitor Radar */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={16} className="text-purple-600" /> Competitor Analysis
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={competitorData}>
              <PolarGrid stroke="rgba(124, 58, 237, 0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(31, 41, 55, 0.6)', fontSize: 11 }} />
              <Radar name="You" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} />
              <Radar name="Comp. 1" dataKey="B" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.1} />
              <Radar name="Comp. 2" dataKey="C" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(31, 41, 55, 0.6)' }} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '10px', color: '#1F2937', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Forecast */}
      <div className="glass-card p-6">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-green-600" /> Revenue Forecast (6 Month)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.08)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(31, 41, 55, 0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(31, 41, 55, 0.5)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '10px', color: '#1F2937', fontSize: 12 }}
              formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Projects */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">Your Startup Projects</h3>
          <Link to="/validate" className="text-sm text-purple-600 hover:text-purple-500 flex items-center gap-1 transition-colors">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {loadingIdeas ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl shimmer" />)}
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
              <Zap size={28} style={{ color: '#7C3AED' }} />
            </div>
            <p className="text-gray-800 font-semibold mb-1">No projects yet</p>
            <p className="text-sm mb-4" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Create your first startup project and let AI do the heavy lifting.</p>
            <Link to="/validate" className="btn-primary text-sm">
              <Plus size={15} /> Create First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ideas.slice(0, 5).map(idea => (
              <div key={idea.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #7C3AED22, #06B6D422)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    {idea.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{idea.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{idea.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {idea.validation_score > 0 && (
                    <span className="badge badge-purple">Score: {idea.validation_score}</span>
                  )}
                  <span className={`badge ${idea.status === 'validated' ? 'badge-green' : 'badge-cyan'}`}>
                    {idea.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
