import Navbar from "../components/Navbar";
import "./About.css";

function About() {
    return (
        <div className="about-page">
            <Navbar />

            <section className="about-section">

                <div className="about-content">

                    <img
                        src="/suhe-logo.png"
                        alt="SuHe"
                        className="about-logo"
                    />

                    <p className="about-label">
                        SUHE SMART PARKING
                    </p>

                    <h1>
                        Smart Parking Made Simple
                    </h1>

                    <p className="about-description">
                        SuHe Smart Parking helps drivers find,
                        book and manage parking spaces easily.
                        Parking owners can manage their spaces
                        and booking requests through one platform.
                    </p>

                    <div className="about-features">

                        <div>
                            <span>📍</span>
                            <h3>Find Parking</h3>
                            <p>
                                Find available parking spaces
                                easily.
                            </p>
                        </div>

                        <div>
                            <span>📅</span>
                            <h3>Book Parking</h3>
                            <p>
                                Reserve your parking space
                                before you arrive.
                            </p>
                        </div>

                        <div>
                            <span>🔐</span>
                            <h3>Secure Check-In</h3>
                            <p>
                                Use OTP verification for secure
                                parking access.
                            </p>
                        </div>

                    </div>

                </div>

            </section>
        </div>
    );
}

export default About;