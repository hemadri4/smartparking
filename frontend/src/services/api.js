import axios from "axios";

const BASE_URL =
    "https://smartparking-api-hemadri.onrender.com/api";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

let csrfToken = null;

// Get CSRF token from Django
const getCsrfToken = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/csrf/`,
            {
                withCredentials: true,
            }
        );

        csrfToken = response.data.csrfToken;

        return csrfToken;
    } catch (error) {
        console.error("CSRF TOKEN ERROR:", error);
        throw error;
    }
};

// Automatically add CSRF token to POST/PUT/PATCH/DELETE
api.interceptors.request.use(
    async (config) => {
        const method = config.method?.toLowerCase();

        if (
            method &&
            ["post", "put", "patch", "delete"].includes(method)
        ) {
            const token = await getCsrfToken();

            config.headers = config.headers || {};
            config.headers["X-CSRFToken"] = token;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
