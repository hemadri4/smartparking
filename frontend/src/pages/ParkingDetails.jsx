import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

                setError("Parking space not found.");

            } finally {

                setLoading(false);
            }
        };

        fetchParking();

    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="parking-details-message">
                    Loading...
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="parking-details-message">
                    {error}
                </div>
            </>
        );
    }

    return (
        <div className="parking-details-page">

            <Navbar />

            <section className="parking-details">

                <div className="parking-details-card">

                    <div className="parking-details-top">

                        <span className="parking-details-icon">
                            🅿️
                        </span>

                        <span className="parking-details-available">
                            {parking.is_available
                                ? "Available"
                                : "Unavailable"}
                        </span>

                    </div>

                    <h1>
                        {parking.parking_name}
                    </h1>

                    <p className="parking-details-location">
                        📍 {parking.address}, {parking.city}
                    </p>

                    <p className="parking-description">
                        {parking.description || "No description available."}
                    </p>

                    <div className="parking-details-info">

                        <div>
                            <span>Capacity</span>
                            <strong>
                                {parking.capacity}
                            </strong>
                        </div>

                        <div>
                            <span>Available Slots</span>
                            <strong>
                                {parking.capacity - parking.occupied_slots}
                            </strong>
                        </div>

                        <div>
                            <span>Price</span>
                            <strong>
                                ₹{parking.price_per_minute}/min
                            </strong>
                        </div>

                    </div>

                    <a
                        href={`https://www.google.com/maps?q=${parking.latitude},${parking.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="maps-button"
                    >
                        📍 View on Google Maps
                    </a>

                    <Link
                        to={`/booking/${parking.id}`}
                        className="book-button"
                    >
                        Book Parking
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default ParkingDetails;