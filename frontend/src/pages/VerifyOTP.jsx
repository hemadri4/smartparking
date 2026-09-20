import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./VerifyOTP.css";

function VerifyOTP() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.get("/csrf/");

            await api.post(
                `/booking/${id}/verify-otp/`,
                { otp }
            );

            alert("OTP verified successfully!");
            navigate(`/check-in/${id}`);
        } catch (err) {
            setError(
                err.response?.data?.error || "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-otp-page">
            <Navbar />

            <section className="verify-otp-section">
                <div className="verify-otp-card">
                    <div className="otp-icon">🔐</div>

                    <h1>Verify OTP</h1>

                    <p>
                        Enter the 6-digit OTP generated for your booking.
                    </p>

                    {error && (
                        <div className="otp-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerify}>
                        <label>OTP</label>

                        <input
                            type="text"
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default VerifyOTP;