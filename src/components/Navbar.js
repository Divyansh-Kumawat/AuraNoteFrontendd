import React, { useEffect, useState } from 'react'
import {
    Link,
    useLocation
} from "react-router-dom";
import { useNavigate } from 'react-router-dom'; 

export const Navbar = () => {
    let Navigate = useNavigate();
    let location = useLocation();
    const [username, setUsername] = useState("");

    useEffect(() => {
        // Fetch username if token exists
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/auth/getuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.name) setUsername(data.name);
            });
        } else {
            setUsername("");
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        Navigate("/login");
    }

    return (
        <nav
            className="navbar navbar-expand-lg sticky-top"
            style={{ background: "#212529", zIndex: 1020 }}
        >
            <div className="container-fluid">
                <Link className="navbar-brand text-light" to="/" style={{ padding: 0 }}>
                  <img
                    src={process.env.PUBLIC_URL + "/auranoteslogo.png"}
                    alt="AuraNotes Logo"
                    style={{
                      height: "82px",
                      width: "108px",
                      background: "transparent",
                      objectFit: "cover",
                      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0))",
                    }}
                  />
                </Link>
                <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                    {username && (
                        <span className="text-light fw-bold" style={{ fontSize: "1.2rem" }}>
                            Hi, {username}
                        </span>
                    )}
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""} text-light`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="btn btn-primary mx-1" to="/collab" role="button"><i className="fa-solid fa-people-group"></i> Collab</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""} text-light`} to="/about">About</Link>
                        </li>
                    </ul>
                    {!localStorage.getItem("token") ? (
                        <form className="d-flex" role="search">
                            <Link className="btn btn-success mx-1" to="/login" role="button">Login</Link>
                            <Link className="btn btn-danger mx-1" to="/signup" role="button">Sign Up</Link>
                        </form>
                    ) : (
                        <div className="d-flex">
                            <button onClick={handleLogout} className="btn btn-success mx-1">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
export default Navbar
