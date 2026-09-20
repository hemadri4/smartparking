import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
    return (
        <div className="home">

            <Navbar />

            <section className="home-hero">

                <div className="home-content">

                    

                    <h1>
                        Find Your Spot.
                        <br />
                        <span>Book It. Park Easy.</span>
                    </h1>

                   

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


            <section className="home-features">

                <div className="feature">
                    <div className="feature-icon">📍</div>
                    <h3>Find Nearby</h3>
                    <p>
                        Discover available parking spaces near you.
                    </p>
                </div>

                <div className="feature">
                    <div className="feature-icon">📅</div>
                    <h3>Book Easily</h3>
                    <p>
                        Reserve your parking space in a few clicks.
                    </p>
                </div>

                <div className="feature">
                    <div className="feature-icon">🔐</div>
                    <h3>Secure Check-in</h3>
                    <p>
                        Use OTP verification for secure entry.
                    </p>
                </div>

                <div className="feature">
                    <div className="feature-icon">💳</div>
                    <h3>Pay by Time</h3>
                    <p>
                        Pay according to your actual parking time.
                    </p>
                </div>

            </section>


            <section className="home-how">

                <h2>How SuHe Smart Parking Works</h2>

                <div className="home-steps">

                    <div>
                        <strong>01</strong>
                        <h3>Search</h3>
                        <p>Find available parking.</p>
                    </div>

                    <div>
                        <strong>02</strong>
                        <h3>Book</h3>
                        <p>Reserve your parking space.</p>
                    </div>

                    <div>
                        <strong>03</strong>
                        <h3>Check In</h3>
                        <p>Verify OTP and park.</p>
                    </div>

                    <div>
                        <strong>04</strong>
                        <h3>Check Out</h3>
                        <p>Pay for your parking time.</p>
                    </div>

                </div>

            </section>


            <footer className="home-footer">

                <img src="/suhe-logo.png" alt="SuHe" />

                <p>
                    SuHe Smart Parking © 2026
                </p>

            </footer>

        </div>
    );
}

export default Home;