import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

    return <p>Logging out...</p>;
}

export default Logout;