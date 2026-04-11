import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import EventsPage from './pages/Eventspage';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';
import PaymentSuccess from './pages/PaymentSuccess';

const AppLayout = ({ children }) => {
  const location = useLocation();
  // Exclude sidebar from login and register pages
  const noSidebarRoutes = ['/login', '/register'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  if (!showSidebar) return <>{children}</>;

  return (
    <div className="flex">
      {children}
    </div>
  );
};

// 4. UPDATED APP COMPONENT
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* ADDED TOASTER HERE TO SHOW ERROR/SUCCESS POPUPS */}
        <Toaster position="top-center" />

        <AppLayout>
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
          </Routes>
        </AppLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;