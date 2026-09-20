import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./OwnerDashboard.css";

function OwnerDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get("/owner-bookings/");
                setBookings(response.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const pending = bookings.filter(
        (booking) => booking.status === "pending"
    ).length;

    const confirmed = bookings.filter(
        (booking) => booking.status === "confirmed"
    ).length;

    const completed = bookings.filter(
        (booking) => booking.status === "completed"
    ).length;

    return (
        <div className="owner-dashboard-page">
            <Navbar />

            <section className="owner-dashboard-section">
                <h1>Owner Dashboard</h1>
                <p>Manage your parking bookings.</p>

                <div className="owner-stats">

                    <div className="owner-stat-card">
                        <span>Pending</span>
                        <strong>{pending}</strong>
                    </div>

                    <div className="owner-stat-card">
                        <span>Confirmed</span>
                        <strong>{confirmed}</strong>
                    </div>

                    <div className="owner-stat-card">
                        <span>Completed</span>
                        <strong>{completed}</strong>
                    </div>

                    <div className="owner-stat-card">
                        <span>Total Bookings</span>
                        <strong>{bookings.length}</strong>
                    </div>

                </div>

                <div className="owner-dashboard-actions">
                    <Link to="/owner-bookings">
                        Manage Booking Requests
                    </Link>
                </div>

                {loading && <p>Loading dashboard...</p>}
            </section>
        </div>
    );
}

export default OwnerDashboard;