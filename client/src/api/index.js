import Axios from "axios";

const baseURLDev = `http://${window.location.hostname}:3001`
const baseURLProd = window.location.href

export default Axios.create({
    withCredentials: true
});