import React from 'react';
import '../Login/Login.css';
import { CardImg, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import swinai from '../../assets/swinai.png';

const Register = () => {
    const navigate = useNavigate();

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
                  <form>
                    <h2 className="font-weight-bold mb-4">Register</h2>
                    <FormGroup>
                      <Label className="font-weight-bold mb-2">Full Name</Label>
                      <Input
                        className="mb-3"
                        type="text"
                        placeholder="John Doe"
                      />
                      <Label className="font-weight-bold mb-2">Email</Label>
                      <Input
                        className="mb-3"
                        type="email"
                        placeholder="John@example.com"
                      />
                      <Label className="font-weight-bold mb-2">Password</Label>
                      <Input
                        className="mb-3"
                        type="password"
                        placeholder="At least 8 characters"
                      />
                      <Label className="font-weight-bold mb-2">Confirm Password</Label>
                      <Input
                        className="mb-3"
                        type="password"
                        placeholder="Confirm your password"
                      />
                    </FormGroup>
                    <Button className="mt-3 btn">Register</Button>
                    <Button 
                      className="mt-3 btn"
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