import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();

        if (search.trim()) {
            navigate(`/parking?search=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <nav className="navbar">

            <Link to="/" className="navbar-logo">
                <img src="/suhe-logo.png" alt="SuHe" />
            </Link>

            <div className="navbar-links">

                <Link to="/">Home</Link>

                <Link to="/parking">
                    Find Parking
                </Link>

                {user?.role === "user" && (
                    <Link to="/my-bookings">
                        My Bookings
                    </Link>
                )}

                {user?.role === "owner" && (
                    <>
                        <Link to="/owner-dashboard">
                            Dashboard
                        </Link>

                        <Link to="/owner-parking">
                            My Parking
                        </Link>

                        <Link to="/owner-bookings">
                            Booking Requests
                        </Link>
                    </>
                )}

                {user?.role === "governement" && (
                    <Link to="/government-dashboard">
                        Government Dashboard
                    </Link>
                )}

                <Link to="/about">
                    About
                </Link>

            </div>

            <form
                className="navbar-search"
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    placeholder="Search parking..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button type="submit">
                    🔍
                </button>
            </form>

            <div className="navbar-buttons">

                {user ? (
                    <Link
                        to="/logout"
                        className="navbar-login"
                    >
                        Logout
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="navbar-login"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="navbar-signup"
                        >
                            Sign Up
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;