import React from 'react';
import './Login.css';
import { CardImg, FormGroup, Label, Input, Button } from 'reactstrap';
import swinai from './swinai.png';

const Login = () => {
    return (
        <div className="background">
          <div className="login-box">
            <div className="container">
              <div class="row app-des">
                <div class="col left-background ">
                 
                  <CardImg
                    className="mobile-img"
                    src={swinai}
                    alt="mobile-App"
                  />
                </div>
                <div class="col login-form">
                  <form>
                    <h2 className="font-weight-bold mb-4">Login</h2>
                    <FormGroup>
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
                    </FormGroup>
                    <Button className="mt-3  btn">Login</Button>
                    <Button className="mt-3  btn">Don't have an account? Sign up</Button>
                    {/* <div className="text-center m-4">or continue with social account</div>
                  <GoogleLoginButton className="mt-3 mb-3 px-auto text-center"/> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
);
};

export default Login;