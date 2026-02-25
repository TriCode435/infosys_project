import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Footer from './components/layout/Footer';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

import UserDashboard from './pages/user/UserDashboard';
import ActivityPage from './pages/user/ActivityPage';
import NutritionPage from './pages/user/NutritionPage';
import BMIPage from './pages/user/BMIPage';
import ProfilePage from './pages/user/ProfilePage';
import UserWeeklyPlan from './pages/user/UserWeeklyPlan';
import CommunityPage from './pages/user/CommunityPage';
import FindTrainer from './pages/user/FindTrainer';
import TrainerProfile from './pages/user/TrainerProfile';

import TrainerDashboard from './pages/trainer/TrainerDashboard';
import UserDetailDashboard from './pages/trainer/UserDetailDashboard';
import AthleteInsightPage from './pages/trainer/AthleteInsightPage';
import TrainerUserPerformanceView from './pages/trainer/TrainerUserPerformanceView';

import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontWeight: 900,
          color: 'var(--primary)',
        }}
      >
        INITIALIZING PROTOCOL...
      </div>
    );

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" />;

  return children;
};

function App() {
  const { user } = useAuth();
  const location = useLocation(); // ⭐ detect current page

  return (
    <div className="min-h-screen bg-background pb-24">

      <Routes>

        {/* ⭐ FULL WIDTH LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* ⭐ ALL OTHER PAGES */}
        <Route
          path="*"
          element={
            <div className="main-container pt-6">
              <Routes>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* User Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/activity"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <ActivityPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nutrition"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <NutritionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bmi"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <BMIPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'TRAINER']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/weekly-plan"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <UserWeeklyPlan />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'TRAINER', 'ADMIN']}>
                      <CommunityPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/find-trainer"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <FindTrainer />
                    </ProtectedRoute>
                  }
                />

                {/* Trainer Routes */}
                <Route
                  path="/trainer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['TRAINER']}>
                      <TrainerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/user-details/:id"
                  element={
                    <ProtectedRoute allowedRoles={['TRAINER']}>
                      <UserDetailDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/athlete-insight/:userId"
                  element={
                    <ProtectedRoute allowedRoles={['TRAINER']}>
                      <AthleteInsightPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/athlete-performance/:userId"
                  element={
                    <ProtectedRoute allowedRoles={['TRAINER']}>
                      <TrainerUserPerformanceView />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

              </Routes>
            </div>
          }
        />
      </Routes>

      {/* ⭐ FOOTER HIDDEN ON LANDING PAGE */}
      {user && location.pathname !== "/" && <Footer />}

    </div>
  );
}

export default App;