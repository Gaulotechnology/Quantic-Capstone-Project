import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import theme from './theme';
import { store } from './store';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { PublicJobsPage } from './pages/PublicJobsPage';
import { LandingPage } from './pages/LandingPage';
import { 
  AboutPage, 
  ServicesPage, 
  PricingPage, 
  PrivacyPolicyPage, 
  TermsOfServicePage,
  ExclusiveRolesPage,
  TalentMappingPage,
  PartnerWithUsPage,
  ExecutiveSearchPage,
  HiringGuidePage
} from './pages/PublicPages';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ScrollProgress } from './components/common/ScrollProgress';
import { BackToTop } from './components/common/BackToTop';
import { CookieConsent } from './components/common/CookieConsent';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Candidate Pages
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { CandidateProfile } from './pages/candidate/CandidateProfile';
import { CandidateJobs } from './pages/candidate/CandidateJobs';
import { CandidateApplications } from './pages/candidate/CandidateApplications';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { RecruiterJobs } from './pages/recruiter/RecruiterJobs';
import { CandidateSearch } from './pages/recruiter/CandidateSearch';
import { ShortlistsPage } from './pages/recruiter/ShortlistsPage';
import { RecruiterChat } from './pages/recruiter/RecruiterChat';
import { CVManagement } from './pages/recruiter/CVManagement';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes (no sidebar) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<PublicJobsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/exclusive-roles" element={<ExclusiveRolesPage />} />
            <Route path="/talent-mapping" element={<TalentMappingPage />} />
            <Route path="/partner" element={<PartnerWithUsPage />} />
            <Route path="/executive-search" element={<ExecutiveSearchPage />} />
            <Route path="/hiring-guide" element={<HiringGuidePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Routes */}
            <Route element={<AppLayout />}>
              {/* Candidate Routes */}
              <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateDashboard /></ProtectedRoute>} />
              <Route path="/candidate/profile" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateProfile /></ProtectedRoute>} />
              <Route path="/candidate/jobs" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateJobs /></ProtectedRoute>} />
              <Route path="/candidate/applications" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateApplications /></ProtectedRoute>} />

              {/* Recruiter Routes */}
              <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}><RecruiterDashboard /></ProtectedRoute>} />
              <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}><RecruiterJobs /></ProtectedRoute>} />
              <Route path="/recruiter/search" element={<ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}><CandidateSearch /></ProtectedRoute>} />
              <Route path="/recruiter/matching" element={<Navigate to="/recruiter/search" replace />} />
              <Route path="/recruiter/shortlists" element={<ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}><ShortlistsPage /></ProtectedRoute>} />
              <Route path="/recruiter/chat" element={<ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}><RecruiterChat /></ProtectedRoute>} />
              <Route path="/recruiter/cvs" element={<ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}><CVManagement /></ProtectedRoute>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <WhatsAppButton />
          <ScrollProgress />
          <BackToTop />
          <CookieConsent />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
