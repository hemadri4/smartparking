import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Logout.css";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await api.get("/csrf/");
                await api.post("/logout/");
            } catch (err) {
                console.log(err);
            }

            localStorage.removeItem("user");
            navigate("/login");
        };

        logoutUser();
    }, [navigate]);

    return (
        <div className="logout-page">
            <div className="logout-card">
                <div className="logout-spinner"></div>
                <h2>Logging out...</h2>
                <p>Please wait while we securely log you out.</p>
            </div>
        </div>
    );
}

export default Logout;