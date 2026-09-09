import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Classes from './pages/Classes.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'

import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx'

import StudentLogin from './pages/student/StudentLogin.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import MyBatch from './pages/student/MyBatch.jsx'
import Recipes from './pages/student/Recipes.jsx'
import RecipeDetail from './pages/student/RecipeDetail.jsx'
import Profile from './pages/student/Profile.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Batches from './pages/admin/Batches.jsx'
import Students from './pages/admin/Students.jsx'
import AdminRecipes from './pages/admin/Recipes.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public marketing site */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/classes" element={<PublicLayout><Classes /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Student portal */}
        <Route path="/student-portal" element={<Navigate to="/student-portal/login" replace />} />
        <Route path="/student-portal/login" element={<StudentLogin />} />
        <Route path="/student-portal/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student-portal/my-batch" element={<ProtectedRoute><MyBatch /></ProtectedRoute>} />
        <Route path="/student-portal/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
        <Route path="/student-portal/recipes/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
        <Route path="/student-portal/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin — never linked from public navigation */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/batches" element={<AdminProtectedRoute><Batches /></AdminProtectedRoute>} />
        <Route path="/admin/students" element={<AdminProtectedRoute><Students /></AdminProtectedRoute>} />
        <Route path="/admin/recipes" element={<AdminProtectedRoute><AdminRecipes /></AdminProtectedRoute>} />
        <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}
