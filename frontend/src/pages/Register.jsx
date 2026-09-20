import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        phone: "",
        email: "",
        role: "",
        password: "",
        confirm_password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            const response = await api.post(
                "/register/",
                {
                    full_name: formData.full_name,
                    username: formData.username,
                    phone: formData.phone,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password
                }
            );

            console.log("REGISTER SUCCESS:", response.data);

            alert("Registration successful!");

            navigate("/login");

        } catch (err) {

            console.log("REGISTER ERROR:", err);
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);

            if (err.response?.data?.error) {

                setError(err.response.data.error);

            } else if (err.response?.data) {

                setError(
                    JSON.stringify(err.response.data)
                );

            } else {

                setError(
                    "Cannot connect to Django server."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <Navbar />

            <section className="register-section">

                <div className="register-card">

                    <div className="register-header">

                        <img
                            src="/suhe-logo.png"
                            alt="SuHe"
                        />

                        <h1>Create Account</h1>

                        <p>
                            Join SuHe Smart Parking
                        </p>

                    </div>

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

                    <form onSubmit={handleRegister}>

                        <label>Full Name</label>

                        <input
                            type="text"
                            name="full_name"
                            placeholder="Enter your full name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />

                        <label>Username</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        <label>Phone Number</label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <label>Role</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select Role
                            </option>

                            <option value="user">
                                User
                            </option>

                            <option value="owner">
                                Parking Owner
                            </option>
                        </select>

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Confirm password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    <p className="register-login">
                        Already have an account?
                        {" "}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>

                </div>

            </section>

        </div>
    );
}

export default Register;