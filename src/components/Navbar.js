import React, { useEffect } from 'react'
import {
    Link,
    useLocation
} from "react-router-dom";

import { useNavigate } from 'react-router-dom'; 
export const Navbar = () => {
    let Navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        Navigate("/login");
    }
    let location = useLocation();
    useEffect(() => {
    }, [location]);
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Navbar</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                            </li>
                        </ul>
                        {!localStorage.getItem("token")?<form className="d-flex" role="search">
                            <Link className="btn btn-success mx-1" to="/login" role="button">Login</Link>
                            <Link className="btn btn-danger mx-1" to="/signup" role="button">Sign Up</Link>
                            
                        </form>:<button onClick={handleLogout} className="btn btn-success mx-1">Logout</button>}
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default Navbar
