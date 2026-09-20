import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./OwnerBookings.css";

function OwnerBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadBookings = async () => {
        try {
            const response = await api.get("/owner-bookings/");
            setBookings(response.data);
        } catch (err) {
            setError(err.response?.data?.error || "Unable to load bookings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.get("/csrf/");
            
            await api.post(`/booking/${id}/status/`, { status });
            loadBookings();
        } catch (err) {
            alert(err.response?.data?.error || "Unable to update booking.");
        }
    };

    return (
        <div className="owner-bookings-page">
            <Navbar />

            <section className="owner-bookings-section">
                <h1>Booking Requests</h1>
                <p>Manage parking booking requests.</p>

                {loading && <p>Loading bookings...</p>}

                {error && <p className="owner-bookings-error">{error}</p>}

                {!loading && !error && bookings.length === 0 && (
                    <p>No booking requests found.</p>
                )}

                <div className="owner-bookings-grid">
                    {bookings.map((booking) => (
                        <div className="owner-booking-card" key={booking.id}>
                            <h2>{booking.parking.parking_name}</h2>

                            <p>
                                <strong>Customer:</strong>{" "}
                                {booking.user.full_name}
                            </p>

                            <p>
                                <strong>Username:</strong>{" "}
                                {booking.user.username}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {booking.user.phone}
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {booking.booking_date}
                            </p>

                            <p>
                                <strong>Time:</strong>{" "}
                                {booking.start_time} - {booking.end_time}
                            </p>

                            <span className={`owner-status ${booking.status}`}>
                                {booking.status.toUpperCase()}
                            </span>

                            {booking.status === "pending" && (
                                <div className="owner-booking-actions">
                                    <button
                                        className="accept-button"
                                        onClick={() =>
                                            updateStatus(
                                                booking.id,
                                                "confirmed"
                                            )
                                        }
                                    >
                                        Accept
                                    </button>

                                    <button
                                        className="reject-button"
                                        onClick={() =>
                                            updateStatus(
                                                booking.id,
                                                "cancelled"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default OwnerBookings;