import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import OverOns from './pages/OverOns';
import Leden from './pages/Leden';
import LidDetail from './pages/LidDetail';
import BoardContact from './pages/BoardContact';
import Agenda from './pages/Agenda';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import WordLid from './pages/WordLid';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-grow w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/over-ons" element={<OverOns />} />
              <Route path="/leden" element={<Leden />} />
              <Route path="/leden/:id" element={<LidDetail />} />
              <Route path="/board-contact" element={<BoardContact />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/agenda/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/word-lid" element={<WordLid />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
