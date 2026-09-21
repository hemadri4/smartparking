import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./ParkingDetails.css";

function ParkingDetails() {
    const { id } = useParams();

    const [parking, setParking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchParking = async () => {
            try {
                const response = await api.get(`/parking/${id}/`);
                setParking(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.error ||
                    "Unable to load parking details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchParking();
    }, [id]);

    if (loading) {
        return (
            <div className="parking-details-page">
                <Navbar />
                <div className="parking-details-message">
                    Loading parking details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="parking-details-page">
                <Navbar />
                <div className="parking-details-message error">
                    {error}
                </div>
            </div>
        );
    }

    if (!parking) {
        return null;
    }

    const availableSlots =
        parking.capacity - parking.occupied_slots;

    return (
        <div className="parking-details-page">

            <Navbar />

            <main className="parking-details-container">

                <Link
                    to="/parking"
                    className="back-to-parking"
                >
                    ← Back to Parking
                </Link>

                <div className="parking-details-card">

                    <div className="parking-details-header">

                        <div>
                            <span className="parking-details-label">
                                SMART PARKING
                            </span>

                            <h1>{parking.parking_name}</h1>

                            <p className="parking-details-location">
                                📍 {parking.address}, {parking.city}
                            </p>
                        </div>

                        <div
                            className={`parking-status ${
                                parking.is_available &&
                                availableSlots > 0
                                    ? "available"
                                    : "full"
                            }`}
                        >
                            {parking.is_available &&
                            availableSlots > 0
                                ? "Available"
                                : "Full"}
                        </div>

                    </div>

                    <div className="parking-details-grid">

                        <div className="parking-info-box">
                            <span>Available Slots</span>
                            <strong>
                                {availableSlots}
                                <small> / {parking.capacity}</small>
                            </strong>
                        </div>

                        <div className="parking-info-box">
                            <span>Price</span>
                            <strong>
                                ₹{parking.price_per_minute}
                                <small> / min</small>
                            </strong>
                        </div>

                        <div className="parking-info-box">
                            <span>City</span>
                            <strong>{parking.city}</strong>
                        </div>

                    </div>

                    <div className="parking-description">

                        <h2>About This Parking</h2>

                        <p>
                            {parking.description ||
                                "Convenient parking space available for booking."}
                        </p>

                    </div>

                    <div className="parking-location-section">

                        <h2>Location</h2>

                        <p>
                            {parking.address}, {parking.city}
                        </p>

                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${parking.latitude},${parking.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="maps-button"
                        >
                            📍 Open in Google Maps
                        </a>

                    </div>

                    <div className="parking-book-section">

                        {parking.is_available &&
                        availableSlots > 0 ? (
                            <Link
                                to={`/booking/${parking.id}`}
                                className="book-parking-button"
                            >
                                Book This Parking
                            </Link>
                        ) : (
                            <button
                                className="book-parking-button disabled"
                                disabled
                            >
                                Parking Full
                            </button>
                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default ParkingDetails;