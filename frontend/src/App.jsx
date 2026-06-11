import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'

// Pages
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/dashboard/Dashboard'
import IdeaValidation from './pages/validation/IdeaValidation'
import MarketResearch from './pages/market/MarketResearch'
import CompetitorAnalysis from './pages/competitors/CompetitorAnalysis'
import LeanCanvas from './pages/canvas/LeanCanvas'
import MVPRoadmap from './pages/roadmap/MVPRoadmap'
import RevenueModel from './pages/revenue/RevenueModel'
import BrandingStudio from './pages/branding/BrandingStudio'
import PitchDeck from './pages/pitchdeck/PitchDeck'
import InvestorMatching from './pages/investors/InvestorMatching'
import MarketingStrategy from './pages/marketing/MarketingStrategy'
import ReadinessAssessment from './pages/assessment/ReadinessAssessment'
import AIChatAssistant from './pages/chat/AIChatAssistant'
import TrendPrediction from './pages/trends/TrendPrediction'
import AdminPanel from './pages/admin/AdminPanel'
import UserProfile from './pages/profile/UserProfile'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#FAF8FF' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading StartupOS AI...</p>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

        {/* Protected - inside Layout */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/validate" element={<ProtectedRoute><Layout><IdeaValidation /></Layout></ProtectedRoute>} />
        <Route path="/market-research" element={<ProtectedRoute><Layout><MarketResearch /></Layout></ProtectedRoute>} />
        <Route path="/competitors" element={<ProtectedRoute><Layout><CompetitorAnalysis /></Layout></ProtectedRoute>} />
        <Route path="/lean-canvas" element={<ProtectedRoute><Layout><LeanCanvas /></Layout></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Layout><MVPRoadmap /></Layout></ProtectedRoute>} />
        <Route path="/revenue" element={<ProtectedRoute><Layout><RevenueModel /></Layout></ProtectedRoute>} />
        <Route path="/branding" element={<ProtectedRoute><Layout><BrandingStudio /></Layout></ProtectedRoute>} />
        <Route path="/pitch-deck" element={<ProtectedRoute><Layout><PitchDeck /></Layout></ProtectedRoute>} />
        <Route path="/investors" element={<ProtectedRoute><Layout><InvestorMatching /></Layout></ProtectedRoute>} />
        <Route path="/marketing" element={<ProtectedRoute><Layout><MarketingStrategy /></Layout></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><Layout><ReadinessAssessment /></Layout></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Layout><AIChatAssistant /></Layout></ProtectedRoute>} />
        <Route path="/trends" element={<ProtectedRoute><Layout><TrendPrediction /></Layout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Layout><AdminPanel /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
