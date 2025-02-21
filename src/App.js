import './App.css';
import Navbar1 from './Navbar1';
import Home1 from './home1';
import Login from './Login';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
   <div className="App">
      <Navbar1 />
      <div className="home1">
        <Routes>
          <Route path="/" element={<Home1 />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
   </div>
);
}

export default App;
