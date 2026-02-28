import { Routes, Route, useLocation } from 'react-router-dom';
import React, { createContext, useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import EventsPage from './pages/Eventspage';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Profile from './pages/Profile';

// 1. CREATE THE THEME CONTEXT
export const ThemeContext = createContext();

// 2. THEME PROVIDER COMPONENT
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. LAYOUT COMPONENT TO KEEP SIDEBAR PERSISTENT
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
        <AppLayout>
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </AppLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;