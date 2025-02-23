import Axios from "axios";

const baseURL = process.env.NODE_ENV === "development"
    ? `http://${window.location.hostname}:3001`
    : "https://your-production-url.com"; // replace with actual production URL

const api = Axios.create({
    baseURL,
    withCredentials: true
});

export default api;