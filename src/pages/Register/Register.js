import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardImg, FormGroup, Label, Input, Button } from 'reactstrap';
import supabase from '../../config/Supabase';
import swinai from '../../assets/swinai.png';
import '../Login/Login.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                navigate('/verify', { state: { email: formData.email } });
            }
        } catch (error) {
            setError(error.message);
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
                        <h2>Create Account</h2>
                        <p>Please fill in the details to register</p>
                    </div>

                    <form className="login-form" onSubmit={handleRegister}>
                        {error && <div className="error-message">{error}</div>}
                        
                        <FormGroup>
                            <Label for="fullName">Full Name</Label>
                            <Input
                                type="text"
                                name="fullName"
                                id="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="confirmPassword">Confirm Password</Label>
                            <Input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                                    Registering...
                                </>
                            ) : (
                                'Register'
                            )}
                        </Button>
                    </form>

                    <div className="login-footer">
                        <p>Already have an account? <a href="/login">Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register; 