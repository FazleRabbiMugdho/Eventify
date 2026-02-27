import { Routes, Route } from 'react-router-dom';
import EventsPage from './pages/Eventspage';
import EventDetails from './pages/EventDetails'; // Import the new details page
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EventsPage />} />
      <Route path="/event/:id" element={<EventDetails />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;