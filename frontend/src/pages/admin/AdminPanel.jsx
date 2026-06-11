import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Users, BarChart2, Rocket, FileText, Trash2, Crown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const activityData = [
  { day: 'Mon', users: 42, startups: 18 },
  { day: 'Tue', users: 58, startups: 24 },
  { day: 'Wed', users: 71, startups: 31 },
  { day: 'Thu', users: 63, startups: 28 },
  { day: 'Fri', users: 89, startups: 45 },
  { day: 'Sat', users: 52, startups: 21 },
  { day: 'Sun', users: 34, startups: 16 },
]

export default function AdminPanel() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user?.role !== 'admin') return
    api.get('/admin/stats').then(res => {
      setStats(res.data.stats)
      setLoadingStats(false)
    }).catch(() => setLoadingStats(false))
    api.get('/admin/users').then(res => setUsers(res.data.users || [])).catch(() => {})
  }, [user])

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(p => p.filter(u => u.id !== userId))
      toast.success('User deleted')
    } catch { toast.error('Failed') }
  }

  const promoteToAdmin = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: 'admin' })
      setUsers(p => p.map(u => u.id === userId ? { ...u, role: 'admin' } : u))
      toast.success('Promoted to admin')
    } catch { toast.error('Failed') }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center glass-card p-12">
          <ShieldCheck size={48} className="mx-auto mb-4" style={{ color: '#EF4444' }} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Admin Access Required</h2>
          <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.5)' }}>You need admin privileges to access this panel.</p>
        </div>
      </div>
    )
  }

  const STAT_CARDS = stats ? [
    { label: 'Total Users', value: stats.total_users?.toLocaleString() || 0, icon: Users, color: '#7C3AED' },
    { label: 'Startups Created', value: stats.total_startups?.toLocaleString() || 0, icon: Rocket, color: '#06B6D4' },
    { label: 'Reports Generated', value: stats.total_reports?.toLocaleString() || 0, icon: FileText, color: '#10B981' },
    { label: 'Active Users', value: stats.active_users?.toLocaleString() || 0, icon: BarChart2, color: '#F59E0B' },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <ShieldCheck size={20} style={{ color: '#EF4444' }} />
            </div>
            Admin Panel
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Platform management and analytics</p>
        </div>
        <span className="badge badge-red">Admin</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['overview', 'users'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
            style={activeTab === tab
              ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }
              : { background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.5)' }}>
            {tab === 'overview' ? '📊 Overview' : '👥 Users'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loadingStats ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl shimmer" />)
            ) : STAT_CARDS.map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${card.color}18`, border: `1px solid ${card.color}33` }}>
                    <card.icon size={18} style={{ color: card.color }} />
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{card.value}</div>
                <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{card.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Activity Chart */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-gray-800 mb-4">Weekly Platform Activity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.08)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(31, 41, 55, 0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(31, 41, 55, 0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: '10px', color: '#1F2937', fontSize: 12 }} />
                <Bar dataKey="users" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Users" />
                <Bar dataKey="startups" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Startups" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(124, 58, 237, 0.06)' }}>
            <p className="text-sm font-semibold text-gray-800">{users.length} registered users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(124, 58, 237, 0.06)' }}>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-black/[0.01] transition-colors" style={{ borderBottom: '1px solid rgba(124, 58, 237, 0.08)' }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                          {u.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${u.role === 'admin' ? 'badge-red' : 'badge-purple'}`}>
                        {u.role === 'admin' && <Crown size={10} className="mr-1" />}{u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {u.role !== 'admin' && (
                          <button onClick={() => promoteToAdmin(u.id)}
                            className="p-1.5 rounded-lg hover:bg-yellow-500/10 transition-colors" title="Promote to admin">
                            <Crown size={13} className="text-yellow-400" />
                          </button>
                        )}
                        <button onClick={() => deleteUser(u.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete user">
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
