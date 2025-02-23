import React, { useState, useRef } from 'react';
import logo from '../assets/swinai.png';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar1.css';
import supabase from '../config/Supabase';
import { useAuth } from '../context/AuthContext';

const Navbar1 = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);
    const { user, loading } = useAuth();

    // Close modal when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setIsModalOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return (
            <nav className="navbar1">
                <img src={logo} alt="logo" />
            </nav>
        );
    }

    return (
        <nav className="navbar1">
            <Link to="/" className="nav-logo">
                <img src={logo} alt="logo" />
            </Link>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                {user ? (
                    <div className="user-section">
                        <button
                            className="avatar-button"
                            onClick={() => setIsModalOpen(!isModalOpen)}
                        >
                            {user.user_metadata.full_name?.charAt(0).toUpperCase() || 'U'}
                        </button>
                        
                        {isModalOpen && (
                            <div className="dropdown-menu" ref={modalRef}>
                                <div className="dropdown-header">
                                    <span className="user-name">
                                        {user.user_metadata.full_name}
                                    </span>
                                    <span className="user-email">{user.email}</span>
                                </div>
                                
                                <div className="dropdown-divider"></div>
                                
                                <Link 
                                    to="/profile" 
                                    className="dropdown-item"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <i className="fas fa-user"></i>
                                    Profile
                                </Link>
                                
                                <Link 
                                    to="/topics" 
                                    className="dropdown-item"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <i className="fas fa-tools"></i>
                                    Tools
                                </Link>
                                
                                <div className="dropdown-divider"></div>
                                
                                <button 
                                    className="dropdown-item logout-button"
                                    onClick={handleLogout}
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="login-btn">Login</Link>
                        <Link to="/register" className="register-btn">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar1;