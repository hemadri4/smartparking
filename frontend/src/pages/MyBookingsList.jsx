import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./MyBookingsList.css";

function MyBookingsList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookings = async () => {
        try {
            const response = await api.get("/my-bookings/");
            setBookings(response.data);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to load bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="my-bookings-list-page">
            <Navbar />

            <section className="my-bookings-list-section">
                <h1>My Bookings</h1>
                <p>View and manage your parking bookings.</p>

                {loading && <p>Loading bookings...</p>}

                {error && (
                    <p className="booking-error">{error}</p>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <p>No bookings found.</p>
                )}

                <div className="my-bookings-grid">
                    {bookings.map((booking) => (
                        <div
                            className="my-booking-card"
                            key={booking.id}
                        >
                            <h2>
                                {booking.parking.parking_name}
                            </h2>

                            <p>
                                📍 {booking.parking.address},{" "}
                                {booking.parking.city}
                            </p>

                            <p>
                                📅 <strong>Date:</strong>{" "}
                                {booking.booking_date}
                            </p>

                            <p>
                                🕐 <strong>Time:</strong>{" "}
                                {booking.start_time} -{" "}
                                {booking.end_time}
                            </p>

                            <p>
                                💰 <strong>Price:</strong>{" "}
                                ₹{booking.parking.price_per_minute}/min
                            </p>

                            <span
                                className={`booking-status ${booking.status}`}
                            >
                                {booking.status.toUpperCase()}
                            </span>

                            {/* CONFIRMED */}
                            {booking.status === "confirmed" &&
                                !booking.otp_verified && (
                                    <Link
                                        to={`/generate-otp/${booking.id}`}
                                        className="booking-action-button"
                                    >
                                        Generate OTP
                                    </Link>
                                )}

                            {/* OTP VERIFIED */}
                            {booking.status === "confirmed" &&
                                booking.otp_verified &&
                                !booking.checked_in && (
                                    <Link
                                        to={`/check-in/${booking.id}`}
                                        className="booking-action-button"
                                    >
                                        Check-In
                                    </Link>
                                )}

                            {/* CHECKED IN */}
                            {booking.checked_in &&
                                !booking.checked_out && (
                                    <Link
                                        to={`/check-out/${booking.id}`}
                                        className="booking-action-button checkout-button"
                                    >
                                        Check-Out
                                    </Link>
                                )}

                            {/* COMPLETED */}
                            {booking.status === "completed" && (
                                <div className="completed-info">
                                    <p>
                                        ⏱️{" "}
                                        <strong>
                                            Parking Time:
                                        </strong>{" "}
                                        {booking.total_minutes} minutes
                                    </p>

                                    <p>
                                        💵{" "}
                                        <strong>
                                            Total Paid:
                                        </strong>{" "}
                                        ₹{booking.total_price}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default MyBookingsList;