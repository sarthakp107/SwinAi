import './App.css';
// import Navbar1 from './components/Navbar1';
import Navbar1 from './components/Navbar1.js';
import Home1 from './pages/Home/home1';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
   <div className="min-h-screen bg-gray-50">
      <Navbar1 />
      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home1 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
   </div>
  );
}

export default App;
