import React from 'react';
import './App.css';
// import Navbar1 from './components/Navbar1';
import Navbar1 from './components/Navbar1.js';
import Home1 from './pages/Home/home1';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Verification from './pages/Verification/Verification';
import Profile from './pages/Profile/Profile';
import TopicSelection from './pages/TopicSelection/TopicSelection';
import AIHumanizer from './pages/AIHumanizer/AIHumanizer';
import AIDetection from './pages/AIDetection/AIDetection';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar1 />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home1 />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verification />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/topics" element={
              <PrivateRoute>
                <TopicSelection />
              </PrivateRoute>
            } />
            <Route path="/ai-humanizer" element={
              <PrivateRoute>
                <AIHumanizer />
              </PrivateRoute>
            } />
            <Route path="/ai-detector" element={
              <PrivateRoute>
                <AIDetection />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
