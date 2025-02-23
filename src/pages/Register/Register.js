import React, { useState } from 'react';
import '../Login/Login.css';
import { CardImg, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import swinai from '../../assets/swinai.png';
import supabase from '../../config/Supabase';

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
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Validate password length
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
                // Navigate to verification page with email
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
            <div className="container">
              <div className="row app-des">
                <div className="col left-background">
                  <CardImg
                    className="mobile-img"
                    src={swinai}
                    alt="mobile-App"
                  />
                </div>
                <div className="col login-form">
                  <form onSubmit={handleRegister}>
                    <h2 className="font-weight-bold mb-4">Register</h2>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <FormGroup>
                      <Label className="font-weight-bold mb-2">Full Name</Label>
                      <Input
                        className="mb-3"
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                      <Label className="font-weight-bold mb-2">Email</Label>
                      <Input
                        className="mb-3"
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <Label className="font-weight-bold mb-2">Password</Label>
                      <Input
                        className="mb-3"
                        type="password"
                        name="password"
                        placeholder="At least 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <Label className="font-weight-bold mb-2">Confirm Password</Label>
                      <Input
                        className="mb-3"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                    <Button 
                      type="submit" 
                      className="btn btn-primary mt-3 w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : null}
                      {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                    <Button 
                      type="button"
                      className="btn btn-outline-primary mt-3 w-100"
                      onClick={() => navigate('/login')}
                    >
                      Already have an account? Login
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default Register; 