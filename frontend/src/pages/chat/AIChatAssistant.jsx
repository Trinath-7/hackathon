import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Plus, Trash2, Zap, User, Bot, Sparkles } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const SUGGESTED_PROMPTS = [
  'How do I validate my startup idea?',
  'What are the best funding strategies for a seed-stage startup?',
  'How do I create a go-to-market strategy?',
  'What should I include in my pitch deck?',
  'How do I find product-market fit?',
  'What metrics should I track as an early-stage startup?',
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-purple-600' : ''}`}
        style={!isUser ? { background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' } : {}}>
        {isUser ? <User size={14} /> : <Zap size={14} />}
      </div>
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
        style={isUser
          ? { background: '#7C3AED', color: 'white' }
          : { background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.85)' }}>
        {msg.content}
        <p className="text-xs mt-1.5" style={{ color: isUser ? 'rgba(255,255,255,0.6)' : 'rgba(31, 41, 55, 0.4)' }}>
          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
    </motion.div>
  )
}

export default function AIChatAssistant() {
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    api.get('/chat/sessions')
      .then(res => setSessions(res.data.sessions || []))
      .catch(() => {})
      .finally(() => setLoadingSessions(false))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const createSession = async () => {
    try {
      const res = await api.post('/chat/sessions')
      const session = res.data.session
      setSessions(p => [session, ...p])
      setActiveSession(session)
      setMessages([])
    } catch { toast.error('Failed to create session') }
  }

  const loadSession = (session) => {
    setActiveSession(session)
    setMessages(session.messages || [])
  }

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation()
    try {
      await api.delete(`/chat/sessions/${sessionId}`)
      setSessions(p => p.filter(s => s.session_id !== sessionId))
      if (activeSession?.session_id === sessionId) { setActiveSession(null); setMessages([]) }
      toast.success('Chat deleted')
    } catch { toast.error('Delete failed') }
  }

  const sendMessage = async (text = input) => {
    const msg = text.trim()
    if (!msg) return
    if (!activeSession) {
      await createSession()
      return
    }
    setInput('')
    const userMsg = { role: 'user', content: msg, timestamp: new Date().toISOString() }
    setMessages(p => [...p, userMsg])
    setLoading(true)
    try {
      const res = await api.post(`/chat/sessions/${activeSession.session_id}/message`, { message: msg })
      const updatedSession = res.data.session
      setMessages(updatedSession.messages || [])
      setSessions(p => p.map(s => s.session_id === activeSession.session_id ? updatedSession : s))
      setActiveSession(updatedSession)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Message failed')
      setMessages(p => p.filter(m => m !== userMsg))
    } finally { setLoading(false) }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 glass-card flex flex-col">
        <div className="p-3 border-b" style={{ borderColor: 'rgba(124, 58, 237, 0.06)' }}>
          <button onClick={createSession} className="btn-primary w-full justify-center text-xs py-2">
            <Plus size={14} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingSessions ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl shimmer" />)}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={24} className="mx-auto mb-2" style={{ color: 'rgba(124, 58, 237, 0.12)' }} />
              <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.4)' }}>No chats yet</p>
            </div>
          ) : (
            sessions.map(session => (
              <div key={session.session_id}
                onClick={() => loadSession(session)}
                className={`group flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all ${activeSession?.session_id === session.session_id ? 'bg-purple-600/15 border border-purple-600/30' : 'hover:bg-purple-50/50'}`}>
                <MessageSquare size={13} style={{ color: activeSession?.session_id === session.session_id ? '#9F67FF' : 'rgba(31, 41, 55, 0.5)', flexShrink: 0 }} />
                <p className="text-xs flex-1 truncate font-medium" style={{ color: activeSession?.session_id === session.session_id ? '#7C3AED' : 'rgba(31, 41, 55, 0.6)' }}>
                  {session.title || 'New Chat'}
                </p>
                <button onClick={(e) => deleteSession(session.session_id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all">
                  <Trash2 size={11} className="text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card flex flex-col min-w-0">
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(124, 58, 237, 0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
            <Zap size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">StartupOS AI Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              <p className="text-xs" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Powered by Google Gemini 1.5 Flash</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {!activeSession ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 float-animation"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', boxShadow: '0 20px 60px rgba(124,58,237,0.4)' }}>
                <Sparkles size={36} />
              </div>
              <h2 className="text-xl font-black text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Your AI Startup Advisor</h2>
              <p className="text-sm mb-8 max-w-sm" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>
                Ask me anything about your startup — validation, fundraising, marketing, product strategy, and more.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, i) => (
                  <button key={i} onClick={() => { createSession().then(() => sendMessage(prompt)) }}
                    className="p-3 rounded-xl text-left text-xs transition-all hover:scale-[1.02]"
                    style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: 'rgba(31, 41, 55, 0.7)' }}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot size={40} style={{ color: 'rgba(124, 58, 237, 0.12)' }} className="mb-4" />
              <p className="text-sm" style={{ color: 'rgba(31, 41, 55, 0.6)' }}>Start a conversation!</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => sendMessage(p)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-purple-600/10"
                    style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)', color: 'rgba(31, 41, 55, 0.7)' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                    <Zap size={14} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1"
                    style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.08)' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#7C3AED', animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(124, 58, 237, 0.06)' }}>
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your startup..."
                rows={1}
                className="input-field resize-none w-full pr-12"
                style={{ minHeight: 44, maxHeight: 120 }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || !activeSession}
              className="btn-primary px-4 py-3 flex-shrink-0"
              style={{ minWidth: 'auto' }}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: 'rgba(124, 58, 237, 0.12)' }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
