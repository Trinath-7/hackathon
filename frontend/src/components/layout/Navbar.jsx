import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Bell, Search, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()
  const [notifications] = useState([
    { id: 1, text: 'AI validation complete for TechVision', time: '2m ago', unread: true },
    { id: 2, text: 'New investor match found: 3 profiles', time: '1h ago', unread: true },
    { id: 3, text: 'Market research report ready', time: '3h ago', unread: false },
  ])
  const [showNotifs, setShowNotifs] = useState(false)
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="flex items-center justify-between px-6 h-16 flex-shrink-0"
      style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(124, 58, 237, 0.12)' }}>

      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-purple-100/50 transition-colors text-gray-500 hover:text-gray-850">
          <Menu size={20} />
        </button>
        <div className="relative hidden md:flex items-center">
          <Search size={15} className="absolute left-3 text-gray-400" />
          <input
            placeholder="Search projects..."
            className="input-field pl-9 py-2 text-sm w-56"
            style={{ background: '#FAF9FE' }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* AI Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <span className="pulse-dot" />
          <span className="text-xs font-medium text-green-600">AI Online</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl hover:bg-purple-100/50 transition-colors text-gray-500 hover:text-gray-850 relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white"
                style={{ background: '#7C3AED', fontSize: '10px' }}>
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 glass-card p-3 z-50 space-y-2 shadow-2xl"
              style={{ boxShadow: '0 20px 60px rgba(124, 58, 237, 0.08)' }}>
              <p className="text-sm font-semibold text-gray-800 px-2 pb-1 border-b" style={{ borderColor: 'rgba(124, 58, 237, 0.12)' }}>
                Notifications
              </p>
              {notifications.map(n => (
                <div key={n.id} className={`p-2 rounded-lg cursor-pointer hover:bg-purple-100/30 transition-colors ${n.unread ? 'bg-purple-50/40' : ''}`}>
                  <div className="flex items-start gap-2">
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />}
                    {!n.unread && <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1.5 flex-shrink-0" />}
                    <div>
                      <p className="text-xs text-gray-700">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        {user && (
          <Link to="/profile">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </Link>
        )}
      </div>
    </header>
  )
}
