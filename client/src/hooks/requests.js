import axios from "axios";
const API_URL = "http://localhost:5000/v1";
async function httpGetPlanets() {
  const response = await axios.get(`${API_URL}/planets`);
  return response.data;
}
async function httpGetLaunches() {
  const response = await axios.get(`${API_URL}/launches`);
  return response.data;
}
async function httpSubmitLaunch(launch) {
  try {
    const response = await axios.post(`${API_URL}/launches`, launch);
    if (response.status === 201) {
      alert("Launch Added");
    }
  } catch (error) {
    if (
      error.response.status === 400 &&
      error.response.data.error === "misson name empty"
    ) {
      alert("Mission name empty");
    } else if (
      error.response.data.error === "misson date empty" &&
      error.response.status === 400
    ) {
      alert("Mission Date empty");
    } else if (error.response.data.error === "invalid date format") {
      alert("Mission Date invalid");
    }
  }
}
async function httpAbortLaunch(id) {
  try {
    const response = await axios.delete(`${API_URL}/launches/${id}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
