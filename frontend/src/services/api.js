import axios from "axios";

const api = axios.create({
    baseURL: "https://smartparking-api-hemadri.onrender.com/api",
    withCredentials: true,
});

export default api;