import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./ParkingList.css";

function ParkingList() {

    const [parkingSpaces, setParkingSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchParking = async () => {

            try {

                const response = await api.get("/parking/");

                setParkingSpaces(response.data);

            } catch (err) {

                setError("Unable to load parking spaces.");

            } finally {

                setLoading(false);
            }
        };

        fetchParking();

    }, []);

    return (
        <div className="parking-page">

            <Navbar />

            <section className="parking-header">

                <p className="parking-label">
                    SUHE SMART PARKING
                </p>

                <h1>Find Parking Near You</h1>

                <p>
                    Search available parking spaces and book your spot.
                </p>

            </section>

            <section className="parking-content">

                {loading && (
                    <p>Loading parking spaces...</p>
                )}

                {error && (
                    <p>{error}</p>
                )}

                {!loading && !error && parkingSpaces.length === 0 && (
                    <p>No parking spaces available.</p>
                )}

                <div className="parking-grid">

                    {parkingSpaces.map((parking) => (

                        <div
                            className="parking-card"
                            key={parking.id}
                        >

                            <div className="parking-card-top">

                                <span className="parking-icon">
                                    🅿️
                                </span>

                                <span className="available-badge">
                                    Available
                                </span>

                            </div>

                            <h2>
                                {parking.parking_name}
                            </h2>

                            <p className="parking-location">
                                📍 {parking.address}, {parking.city}
                            </p>

                            <div className="parking-info">

                                <div>
                                    <span>Available</span>

                                    <strong>
                                        {parking.capacity - parking.occupied_slots}
                                        {" / "}
                                        {parking.capacity}
                                    </strong>
                                </div>

                                <div>
                                    <span>Price</span>

                                    <strong>
                                        ₹{parking.price_per_minute}/min
                                    </strong>
                                </div>

                            </div>

                            <Link
                                to={`/parking/${parking.id}`}
                                className="view-parking"
                            >
                                View Details
                            </Link>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    );
}

export default ParkingList;