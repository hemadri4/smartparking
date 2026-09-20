import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./CheckOut.css";

function CheckOut() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleCheckOut = async () => {
        setLoading(true);
        setError("");

        try {
            await api.get("/csrf/");

            const response = await api.post(
                `/booking/${id}/check-out/`
            );

            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Check-out failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="check-out-page">
            <Navbar />

            <section className="check-out-section">
                <div className="check-out-card">

                    {!result ? (
                        <>
                            <div className="check-out-icon">🏁</div>

                            <h1>Parking Check-Out</h1>

                            <p>
                                Click below when you are leaving
                                the parking space.
                            </p>

                            {error && (
                                <div className="check-out-error">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleCheckOut}
                                disabled={loading}
                            >
                                {loading
                                    ? "Checking Out..."
                                    : "Check Out"}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="check-out-success-icon">
                                ✅
                            </div>

                            <h1>Check-Out Successful</h1>

                            <div className="bill-box">
                                <div>
                                    <span>Booking ID</span>
                                    <strong>#{result.booking_id}</strong>
                                </div>

                                <div>
                                    <span>Total Parking Time</span>
                                    <strong>
                                        {result.total_minutes} minutes
                                    </strong>
                                </div>

                                <div>
                                    <span>Total Price</span>
                                    <strong>
                                        ₹{result.total_price}
                                    </strong>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    navigate("/my-bookings")
                                }
                            >
                                View My Bookings
                            </button>
                        </>
                    )}

                </div>
            </section>
        </div>
    );
}

export default CheckOut;