import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
    return (
        <div className="home">

            <Navbar />

            {/* HERO */}
            <section className="home-hero">

                <div className="home-content">

                    <div className="home-label">
                        SMART PARKING PLATFORM
                    </div>

                    <h1>
                        Find Your Spot.
                        <br />
                        <span>Book It. Park Easy.</span>
                    </h1>

                    <p className="home-description">
                        Find nearby parking spaces, book your spot,
                        verify with OTP, and pay based on your actual
                        parking time.
                    </p>

                    <div className="home-buttons">

                        <Link
                            to="/parking"
                            className="home-primary"
                        >
                            Find Parking
                        </Link>

                        <Link
                            to="/register"
                            className="home-secondary"
                        >
                            Get Started
                        </Link>

                    </div>

                </div>

            </section>

            {/* FEATURES */}
            <section className="home-features">

                <div className="feature">
                    <div className="feature-icon">📍</div>

                    <h3>Find Nearby</h3>

                    <p>
                        Discover available parking spaces
                        near your location.
                    </p>
                </div>

                <div className="feature">
                    <div className="feature-icon">📅</div>

                    <h3>Book Easily</h3>

                    <p>
                        Reserve your parking space
                        in just a few clicks.
                    </p>
                </div>

                <div className="feature">
                    <div className="feature-icon">🔐</div>

                    <h3>Secure Check-in</h3>

                    <p>
                        Use OTP verification for
                        secure parking entry.
                    </p>
                </div>

                <div className="feature">
                    <div className="feature-icon">💳</div>

                    <h3>Pay by Time</h3>

                    <p>
                        Pay according to your actual
                        parking duration.
                    </p>
                </div>

            </section>

            {/* HOW IT WORKS */}
            <section className="home-how">

                <h2>How SuHe Smart Parking Works</h2>

                <div className="home-steps">

                    <div>
                        <strong>01</strong>

                        <h3>Search</h3>

                        <p>
                            Find available parking spaces.
                        </p>
                    </div>

                    <div>
                        <strong>02</strong>

                        <h3>Book</h3>

                        <p>
                            Reserve your parking space.
                        </p>
                    </div>

                    <div>
                        <strong>03</strong>

                        <h3>Check In</h3>

                        <p>
                            Verify OTP and start parking.
                        </p>
                    </div>

                    <div>
                        <strong>04</strong>

                        <h3>Check Out</h3>

                        <p>
                            Pay based on your parking time.
                        </p>
                    </div>

                </div>

            </section>

            {/* FOOTER */}
            <footer className="home-footer">

                <img
                    src="/suhe-logo.png"
                    alt="SuHe Smart Parking"
                />

                <p>
                    SuHe Smart Parking © 2026
                </p>

            </footer>

        </div>
    );
}

export default Home;