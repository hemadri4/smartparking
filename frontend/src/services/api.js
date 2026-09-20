import axios from "axios";

const api = axios.create({
    baseURL: "https://smartparking-api-hemadri.onrender.com/api",
    withCredentials: true,
});

function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        cookie = cookie.trim();

        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(
                cookie.substring(name.length + 1)
            );
        }
    }

    return null;
}

api.interceptors.request.use(
    (config) => {

        if (
            config.method &&
            ["post", "put", "patch", "delete"].includes(
                config.method.toLowerCase()
            )
        ) {

            const csrfToken = getCookie("csrftoken");

            if (csrfToken) {
                config.headers["X-CSRFToken"] = csrfToken;
            }
        }

        return config;
    },

    (error) => Promise.reject(error)
);

export default api;