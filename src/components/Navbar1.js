import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/swinai.png';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar1.css';
import supabase from '../config/Supabase';

const Navbar1 = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        // Get initial auth status
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Close modal when clicking outside
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            subscription.unsubscribe();
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
                    // Logged in navigation
                    <div className="profile-dropdown" ref={modalRef}>
                        <button 
                            className="avatar-button"
                            onClick={() => setIsModalOpen(!isModalOpen)}
                            title={user.user_metadata.full_name || 'User'}
                        >
                            {user.user_metadata.full_name?.charAt(0).toUpperCase() || 'U'}
                        </button>
                        
                        {isModalOpen && (
                            <div className="profile-dropdown-content">
                                <div className="dropdown-header">
                                    <span className="user-name">{user.user_metadata.full_name || 'User'}</span>
                                    <span className="user-email">{user.email}</span>
                                </div>
                                <div className="dropdown-divider"></div>
                                <Link to="/profile" className="dropdown-item" onClick={() => setIsModalOpen(false)}>
                                    <i className="fas fa-user"></i>
                                    <span>Profile</span>
                                </Link>
                                <Link to="/settings" className="dropdown-item" onClick={() => setIsModalOpen(false)}>
                                    <i className="fas fa-cog"></i>
                                    <span>Settings</span>
                                </Link>
                                <Link to="/help" className="dropdown-item" onClick={() => setIsModalOpen(false)}>
                                    <i className="fas fa-question-circle"></i>
                                    <span>Help</span>
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item logout-item" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Logged out navigation
                    <div className="auth-buttons">
                        <Link to="/login" className="nav-link login-btn">Login</Link>
                        <Link to="/register" className="nav-link register-btn">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar1;