import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./CheckIn.css";

function CheckIn() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleCheckIn = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await api.get("/csrf/");

            const response = await api.post(
                `/booking/${id}/check-in/`
            );

            setMessage(response.data.message);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Check-in failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="check-in-page">
            <Navbar />

            <section className="check-in-section">
                <div className="check-in-card">
                    <div className="check-in-icon">🚗</div>

                    <h1>Parking Check-In</h1>

                    <p>
                        Your OTP has been verified.
                        You can now check in to your parking space.
                    </p>

                    {message && (
                        <div className="check-in-success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="check-in-error">
                            {error}
                        </div>
                    )}

                    {!message && (
                        <button
                            onClick={handleCheckIn}
                            disabled={loading}
                        >
                            {loading
                                ? "Checking In..."
                                : "Check In"}
                        </button>
                    )}

                    {message && (
                        <button
                            onClick={() => navigate(`/check-out/${id}`)}
                        >
                            Go to Check-Out
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}

export default CheckIn;