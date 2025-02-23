import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import swinai from '../../assets/swinai.png';
import supabase from '../../config/Supabase';

const Verification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const email = location.state?.email || "your email";

    // Listen for auth state changes
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                navigate('/');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    const handleResendEmail = async () => {
        setIsResending(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });
            
            if (error) throw error;
            
            alert('Verification email has been resent!');
        } catch (error) {
            alert('Error sending verification email. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="background">
            <div className="login-box">
                <div className="container">
                    <div className="row app-des">
                        <div className="col left-background">
                            <img
                                className="mobile-img"
                                src={swinai}
                                alt="Verification"
                            />
                        </div>
                        <div className="col login-form text-center">
                            <div className="verification-content">
                                <h2 className="font-weight-bold mb-4">Verify Your Email</h2>
                                <div className="email-icon mb-4">
                                    📧
                                </div>
                                <p className="mb-4">
                                    We've sent a verification email to:
                                    <br />
                                    <strong>{email}</strong>
                                </p>
                                <p className="mb-4">
                                    Please check your email and click on the verification link to complete your registration.
                                </p>
                                <button 
                                    className="btn btn-primary w-100 mb-3"
                                    onClick={handleResendEmail}
                                    disabled={isResending}
                                >
                                    {isResending ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                                </button>
                                <button 
                                    className="btn btn-outline-primary w-100"
                                    onClick={() => navigate('/login')}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verification; 