import axios from "axios";

export default axios.create({
  baseURL: "https://api.endaoment.org",
  rejectUnauthorized: false
});
