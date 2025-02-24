import Axios from "axios";

const api = Axios.create({
    withCredentials: true
});

export default api;