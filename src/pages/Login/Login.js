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
                navigate('/');
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
                  <form onSubmit={handleLogin}>
                    <h2 className="font-weight-bold mb-4">Login</h2>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <div className="form-group">
                      <label className="font-weight-bold mb-2">Email</label>
                      <input
                        className="form-control mb-3"
                        type="email"
                        placeholder="John@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label className="font-weight-bold mb-2">Password</label>
                      <input
                        className="form-control mb-3"
                        type="password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary mt-3 w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : null}
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <button 
                      type="button"
                      className="btn btn-outline-primary mt-3 w-100"
                      onClick={() => navigate('/register')}
                    >
                      Don't have an account? Sign up
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default Login;