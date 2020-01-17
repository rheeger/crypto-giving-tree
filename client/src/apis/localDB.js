import axios from "axios";

export default axios.create({
  baseURL: "https://api.enadoment.org",
  rejectUnauthorized: false
});
