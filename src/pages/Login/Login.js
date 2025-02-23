import React, { useState } from 'react';
import './Login.css';
import { CardImg, FormGroup, Label, Input, Button } from 'reactstrap';
import swinai from '../../assets/swinai.png';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/Supabase';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                if (error.message.includes('Email not confirmed')) {
                    navigate('/verify', { state: { email } });
                } else {
                    setError("Invalid email or password");
                }
                return;
            }

            if (data.user) {
                navigate('/topics');
            }
        } catch (error) {
            setError("An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="background">
            <div className="login-box">
                <div className="login-logo-section">
                    <CardImg src={swinai} alt="Logo" className="login-logo" />
                </div>
                <div className="login-form-section">
                    <div className="login-header">
                        <h2>Welcome Back!</h2>
                        <p>Please sign in to continue</p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        {error && <div className="error-message">{error}</div>}
                        
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </FormGroup>

                        <Button 
                            color="primary" 
                            type="submit" 
                            disabled={isLoading}
                            className="submit-button"
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;