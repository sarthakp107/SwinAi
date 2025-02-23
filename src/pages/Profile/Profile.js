import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/Supabase';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/login');
                    return;
                }
                const fullName = user.user_metadata?.full_name || 'User';
                setUser({ ...user, fullName });
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [navigate]);

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
            <div className="profile-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h1>{user?.fullName}</h1>
                    <p className="profile-email">{user?.email}</p>
                </div>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-value">0</span>
                        <span className="stat-label">Projects</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">0</span>
                        <span className="stat-label">Tasks</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">Active</span>
                        <span className="stat-label">Status</span>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn-edit">
                        <i className="fas fa-edit"></i>
                        Edit Profile
                    </button>
                    <button className="btn-settings">
                        <i className="fas fa-cog"></i>
                        Settings
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>

                <div className="profile-info">
                    <div className="info-section">
                        <h3>Account Information</h3>
                        <div className="info-item">
                            <span className="info-label">Member Since</span>
                            <span className="info-value">
                                {new Date(user?.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Last Login</span>
                            <span className="info-value">
                                {new Date(user?.last_sign_in_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 