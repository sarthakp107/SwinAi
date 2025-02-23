import React from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/Supabase';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

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
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-grid">
                <div className="profile-sidebar">
                    <div className="profile-picture">
                        {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="sidebar-info">
                        <div className="user-name">{user?.user_metadata?.full_name}</div>
                        <div className="user-email">{user?.email}</div>
                    </div>
                    <div className="sidebar-stats">
                        <div className="stat-item">
                            <div className="stat-value">5</div>
                            <div className="stat-label">Projects</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">12</div>
                            <div className="stat-label">Sessions</div>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    <div className="main-header">
                        <div>
                            <h1 className="header-title">Profile Overview</h1>
                            <p className="header-subtitle">Manage your account settings and preferences</p>
                        </div>
                        <div className="action-buttons">
                            <button className="btn btn-outline">
                                <i className="fas fa-edit"></i>
                                Edit Profile
                            </button>
                            <button className="btn btn-primary" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i>
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="info-cards">
                        <div className="info-card">
                            <div className="card-header">
                                <div className="card-icon">
                                    <i className="fas fa-user"></i>
                                </div>
                                <h2 className="card-title">Personal Information</h2>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Full Name</span>
                                <span className="info-value">{user?.user_metadata?.full_name || 'Not set'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user?.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Member Since</span>
                                <span className="info-value">
                                    {new Date(user?.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="card-header">
                                <div className="card-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <h2 className="card-title">Account Settings</h2>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Account Status</span>
                                <span className="verified-badge">
                                    <i className="fas fa-check-circle"></i>
                                    Active
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email Verification</span>
                                <span className="verified-badge">
                                    <i className="fas fa-check-circle"></i>
                                    Verified
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Two-Factor Auth</span>
                                <span className="info-value">Not Enabled</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 