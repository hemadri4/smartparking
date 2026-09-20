import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./GovernmentDashboard.css";

function GovernmentDashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await api.get(
                    "/government-dashboard/"
                );
                setData(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.error ||
                    "Unable to load dashboard."
                );
            }
        };

        loadDashboard();
    }, []);

    return (
        <div className="government-dashboard-page">
            <Navbar />

            <section className="government-dashboard-section">

                <h1>Government Dashboard</h1>

                <p>
                    Smart parking operational overview
                </p>

                {error && (
                    <div className="government-error">
                        {error}
                    </div>
                )}

                {data && (
                    <div className="government-stats">

                        <div className="government-card">
                            <span>Parking Spaces</span>
                            <strong>
                                {data.total_parking_spaces}
                            </strong>
                        </div>

                        <div className="government-card">
                            <span>Total Capacity</span>
                            <strong>
                                {data.total_capacity}
                            </strong>
                        </div>

                        <div className="government-card">
                            <span>Occupied Slots</span>
                            <strong>
                                {data.occupied_slots}
                            </strong>
                        </div>

                        <div className="government-card">
                            <span>Available Slots</span>
                            <strong>
                                {data.available_slots}
                            </strong>
                        </div>

                        <div className="government-card">
                            <span>Total Bookings</span>
                            <strong>
                                {data.total_bookings}
                            </strong>
                        </div>

                        <div className="government-card">
                            <span>Pending</span>
                            <strong>
                                {data.pending_bookings}
                            </strong>
                        </div>

                        <div className="government-card">
                            <span>Confirmed</span>
                            <strong>
                                {data.confirmed_bookings}
                            </strong>
                        </div>

                        <div className="government-card">
                            <span>Completed</span>
                            <strong>
                                {data.completed_bookings}
                            </strong>
                        </div>

                    </div>
                )}

            </section>
        </div>
    );
}

export default GovernmentDashboard;