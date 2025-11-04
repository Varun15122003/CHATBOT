// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ backgroundColor: '#1e1e2f', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* भविष्य में अन्य routes यहाँ जोड़ें */}
            </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;