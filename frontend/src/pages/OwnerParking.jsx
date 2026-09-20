import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./OwnerParking.css";

function OwnerParking() {
    const [parkingSpaces, setParkingSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        parking_name: "",
        address: "",
        city: "",
        latitude: "",
        longitude: "",
        capacity: "",
        price_per_minute: "",
        description: ""
    });

    const fetchParking = async () => {
        try {
            const response = await api.get("/owner-parking/");
            setParkingSpaces(response.data);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to load parking spaces."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParking();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await api.get("/csrf/");

            await api.post("/add-parking/", {
                ...formData,
                capacity: Number(formData.capacity),
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
                price_per_minute: Number(formData.price_per_minute)
            });

            setMessage("Parking space added successfully.");

            setFormData({
                parking_name: "",
                address: "",
                city: "",
                latitude: "",
                longitude: "",
                capacity: "",
                price_per_minute: "",
                description: ""
            });

            fetchParking();

        } catch (err) {
            console.log("ADD PARKING ERROR:", err);

            setError(
                err.response?.data
                    ? JSON.stringify(err.response.data)
                    : err.message
            );
        }
    };

    return (
        <div className="owner-parking-page">
            <Navbar />

            <section className="owner-parking-section">

                <h1>My Parking Spaces</h1>

                <p>Add and manage your parking spaces.</p>

                {message && (
                    <div className="owner-parking-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="owner-parking-error">
                        {error}
                    </div>
                )}

                <div className="owner-parking-layout">

                    <div className="add-parking-card">

                        <h2>Add Parking Space</h2>

                        <form onSubmit={handleSubmit}>

                            <label>Parking Name</label>

                            <input
                                type="text"
                                name="parking_name"
                                value={formData.parking_name}
                                onChange={handleChange}
                                required
                            />

                            <label>Address</label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />

                            <label>City</label>

                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />

                            <div className="location-row">

                                <div>
                                    <label>Latitude</label>

                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Longitude</label>

                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            <label>Capacity</label>

                            <input
                                type="number"
                                min="1"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />

                            <label>Price Per Minute (₹)</label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="price_per_minute"
                                value={formData.price_per_minute}
                                onChange={handleChange}
                                required
                            />

                            <label>Description</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />

                            <button type="submit">
                                Add Parking
                            </button>

                        </form>

                    </div>

                    <div className="parking-space-list">

                        <h2>My Parking Spaces</h2>

                        {loading && (
                            <p>Loading parking spaces...</p>
                        )}

                        {!loading &&
                            parkingSpaces.length === 0 && (
                                <p>No parking spaces added yet.</p>
                            )}

                        {parkingSpaces.map((parking) => (
                            <div
                                className="owner-parking-card"
                                key={parking.id}
                            >

                                <h3>
                                    {parking.parking_name}
                                </h3>

                                <p>
                                    📍 {parking.address},{" "}
                                    {parking.city}
                                </p>

                                <p>
                                    Capacity:{" "}
                                    {parking.capacity}
                                </p>

                                <p>
                                    Available:{" "}
                                    {parking.capacity -
                                        parking.occupied_slots}
                                </p>

                                <p>
                                    Price: ₹
                                    {parking.price_per_minute}
                                    /min
                                </p>

                                <span>
                                    {parking.is_available
                                        ? "Available"
                                        : "Unavailable"}
                                </span>

                            </div>
                        ))}

                    </div>

                </div>

            </section>
        </div>
    );
}

export default OwnerParking;