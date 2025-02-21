import logo from './swinai.png';



import { Link } from 'react-router-dom';

import './Navbar1.css'; 


const Navbar1 = () => {

    return ( 

        <nav className="navbar1">

            <img src={logo} alt="logo" />

                <div className="navbar-links">

                    <Link to="/">Home</Link>

                    <Link to="/about">About</Link>

                    <Link to="/login">Login</Link>

                    <Link to="/register">Register</Link>

                </div>

        </nav>

     );

}

 

export default Navbar1;