import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Save, Lock, Building2, Camera } from 'lucide-react'

const Linkedin = ({ size = 24, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const Twitter = ({ size = 24, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

import api from '../../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function UserProfile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: '', company: '', bio: '', linkedin: '', twitter: '' })
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (user) setForm({ name: user.name || '', company: user.company || '', bio: user.bio || '', linkedin: user.linkedin || '', twitter: user.twitter || '' })
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/profile/', form)
      updateUser(res.data.user)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') } finally { setLoading(false) }
  }

  const handlePassChange = async (e) => {
    e.preventDefault()
    if (passForm.new_password !== passForm.confirm) return toast.error('Passwords do not match')
    if (passForm.new_password.length < 8) return toast.error('Password must be 8+ characters')
    setPassLoading(true)
    try {
      await api.post('/profile/change-password', { current_password: passForm.current_password, new_password: passForm.new_password })
      toast.success('Password changed!')
      setPassForm({ current_password: '', new_password: '', confirm: '' })
    } catch (err) { toast.error(err.response?.data?.error || 'Failed') } finally { setPassLoading(false) }
  }

  const stats = [
    { label: 'Projects', value: '—' },
    { label: 'Reports', value: '—' },
    { label: 'Days Active', value: user?.created_at ? Math.floor((Date.now() - new Date(user.created_at)) / 86400000) : '—' },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
            <User size={20} style={{ color: '#7C3AED' }} />
          </div>
          Your Profile
        </h1>
      </div>

      {/* Profile Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'white', border: '2px solid rgba(124,58,237,0.4)' }}>
              <Camera size={12} style={{ color: '#7C3AED' }} />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{user?.email}</p>
            {user?.company && <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: 'rgba(31, 41, 55, 0.5)' }}><Building2 size={12} />{user.company}</p>}
          </div>
          <div className="flex gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['profile', 'security'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
            style={activeTab === tab
              ? { background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124, 58, 237, 0.15)', color: '#9F67FF' }
              : { background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.5)' }}>
            {tab === 'profile' ? '👤 Profile' : '🔒 Security'}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Edit Profile</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Company</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Your company" className="input-field pl-9" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Tell the world about yourself..." className="input-field resize-none" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>LinkedIn</label>
                <div className="relative">
                  <Linkedin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/you" className="input-field pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Twitter / X</label>
                <div className="relative">
                  <Twitter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={form.twitter} onChange={e => setForm(p => ({ ...p, twitter: e.target.value }))} placeholder="@yourhandle" className="input-field pl-9" />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={15} /> Save Changes</>}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><Lock size={15} className="text-purple-400" /> Change Password</h3>
          <form onSubmit={handlePassChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Current Password</label>
              <input type="password" value={passForm.current_password} onChange={e => setPassForm(p => ({ ...p, current_password: e.target.value }))}
                placeholder="Enter current password" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>New Password</label>
              <input type="password" value={passForm.new_password} onChange={e => setPassForm(p => ({ ...p, new_password: e.target.value }))}
                placeholder="Min 8 characters" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(31, 41, 55, 0.7)' }}>Confirm New Password</label>
              <input type="password" value={passForm.confirm} onChange={e => setPassForm(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password" className="input-field" />
            </div>
            <button type="submit" disabled={passLoading} className="btn-primary">
              {passLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Lock size={15} /> Update Password</>}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
