import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./GenerateOTP.css";

function GenerateOTP() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateOTP = async () => {
        setLoading(true);
        setError("");

        try {
            await api.get("/csrf/");

            const response = await api.post(
                `/booking/${id}/generate-otp/`
            );

            setOtp(response.data.otp);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to generate OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="generate-otp-page">
            <Navbar />

            <section className="generate-otp-section">
                <div className="generate-otp-card">

                    <div className="generate-otp-icon">
                        🔐
                    </div>

                    <h1>Parking OTP</h1>

                    <p>
                        Generate your OTP before checking in.
                    </p>

                    {error && (
                        <div className="generate-otp-error">
                            {error}
                        </div>
                    )}

                    {!otp ? (
                        <button
                            onClick={generateOTP}
                            disabled={loading}
                        >
                            {loading
                                ? "Generating..."
                                : "Generate OTP"}
                        </button>
                    ) : (
                        <>
                            <div className="otp-display">
                                {otp}
                            </div>

                            <p className="otp-note">
                                Use this OTP to verify your parking
                                check-in.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(`/verify-otp/${id}`)
                                }
                            >
                                Verify OTP
                            </button>
                        </>
                    )}

                </div>
            </section>
        </div>
    );
}

export default GenerateOTP;