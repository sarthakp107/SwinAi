import React, { useState, useEffect } from 'react';
import logo from '../assets/swinai.png';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar1.css';
import supabase from '../config/Supabase';

const Navbar1 = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
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
            <Link to="/">
                <img src={logo} alt="logo" />
            </Link>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                {user ? (
                    // Logged in navigation
                    <>
                        <Link to="/profile">
                           {user.user_metadata.full_name || 'User'}
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    // Logged out navigation
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar1;