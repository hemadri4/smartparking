import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.get("/csrf/");

            const response = await api.post(
                "/login/",
                {
                    username,
                    password
                },
                {
                    withCredentials: true
                }
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/");

        } catch (err) {

            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("Unable to login.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <Navbar />

            <section className="login-section">

                <div className="login-container">

                    <div className="login-info">

                        <img
                            src="/suhe-logo.png"
                            alt="SuHe"
                        />

                        <h1>Smart Parking</h1>

                        <p>
                            Find. Book. Park.
                        </p>

                        <div className="login-features">
                            <div>📍 Find nearby parking</div>
                            <div>📅 Book your parking space</div>
                            <div>🔐 Secure OTP check-in</div>
                            <div>💳 Pay according to parking time</div>
                        </div>

                    </div>

                    <div className="login-card">

                        <h2>Welcome Back</h2>

                        <p className="login-subtitle">
                            Login to your SuHe account
                        </p>

                        {error && (
                            <div
                                style={{
                                    color: "#d92d20",
                                    background: "#fef3f2",
                                    padding: "10px",
                                    borderRadius: "7px",
                                    marginBottom: "18px",
                                    fontSize: "13px"
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>

                            <label>Username</label>

                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                required
                            />

                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                            <div className="login-options">

                                <label>
                                    <input type="checkbox" />
                                    Remember me
                                </label>

                                <a href="#">
                                    Forgot Password?
                                </a>

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"}
                            </button>

                        </form>

                        <div className="login-divider">
                            OR
                        </div>

                        <p className="register-link">
                            Don't have an account?
                            {" "}
                            <Link to="/register">
                                Create Account
                            </Link>
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Login;