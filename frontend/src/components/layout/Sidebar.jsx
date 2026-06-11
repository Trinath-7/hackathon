import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Lightbulb, BarChart2, Users, FileText,
  Map, DollarSign, Palette, PresentationIcon, UserCheck,
  Megaphone, CheckSquare, MessageSquare, TrendingUp,
  ShieldCheck, User, ChevronLeft, Zap, LogOut
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Idea Validation', icon: Lightbulb, path: '/validate' },
  { label: 'Market Research', icon: BarChart2, path: '/market-research' },
  { label: 'Competitors', icon: Users, path: '/competitors' },
  { label: 'Lean Canvas', icon: FileText, path: '/lean-canvas' },
  { label: 'MVP Roadmap', icon: Map, path: '/roadmap' },
  { label: 'Revenue Model', icon: DollarSign, path: '/revenue' },
  { label: 'Branding Studio', icon: Palette, path: '/branding' },
  { label: 'Pitch Deck', icon: PresentationIcon, path: '/pitch-deck' },
  { label: 'Investors', icon: UserCheck, path: '/investors' },
  { label: 'Marketing', icon: Megaphone, path: '/marketing' },
  { label: 'Assessment', icon: CheckSquare, path: '/assessment' },
  { label: 'AI Chat', icon: MessageSquare, path: '/chat' },
  { label: 'Trend Prediction', icon: TrendingUp, path: '/trends' },
]

const bottomItems = [
  { label: 'Admin Panel', icon: ShieldCheck, path: '/admin' },
  { label: 'Profile', icon: User, path: '/profile' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-64 flex-shrink-0 flex flex-col h-full"
          style={{
            background: '#FAF9FE',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(124, 58, 237, 0.12)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-6 border-b" style={{ borderColor: 'rgba(124, 58, 237, 0.12)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>StartupOS</p>
              <p className="text-xs font-semibold" style={{ color: '#7C3AED' }}>AI Platform</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="px-3 pb-4 space-y-1 border-t pt-3" style={{ borderColor: 'rgba(124, 58, 237, 0.12)' }}>
            {bottomItems.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}

            {/* User Info */}
            {user && (
              <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.12)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs truncate" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="p-1 rounded-lg hover:bg-red-500/10 transition-colors" title="Logout">
                    <LogOut size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
