import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./MyBooking.css";

function Booking() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [bookingDate, setBookingDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBooking = async (e) => {

        e.preventDefault();

        setError("");

        if (startTime >= endTime) {
            setError("End time must be after start time.");
            return;
        }

        setLoading(true);

        try {
            await api.get("/csrf/");

            const response = await api.post(
                `/booking/${id}/`,
                {
                    booking_date: bookingDate,
                    start_time: startTime,
                    end_time: endTime
                }
            );

            navigate("/my-bookings", {
                state: {
                    booking: response.data
                }
            });

        } catch (err) {

            if (err.response?.data?.error) {

                setError(
                    err.response.data.error
                );

            } else if (err.response?.status === 401) {

                setError(
                    "Please login before booking."
                );

            } else {

                setError(
                    "Unable to create booking."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="booking-page">

            <Navbar />

            <section className="booking-section">

                <div className="booking-card">

                    <h1>Book Parking</h1>

                    <p>
                        Select your parking date and time.
                    </p>

                    {error && (
                        <div className="booking-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleBooking}>

                        <label>
                            Booking Date
                        </label>

                        <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) =>
                                setBookingDate(e.target.value)
                            }
                            required
                        />

                        <label>
                            Start Time
                        </label>

                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) =>
                                setStartTime(e.target.value)
                            }
                            required
                        />

                        <label>
                            End Time
                        </label>

                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) =>
                                setEndTime(e.target.value)
                            }
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Booking..."
                                : "Confirm Booking"}
                        </button>

                    </form>

                </div>

            </section>

        </div>
    );
}

export default Booking;