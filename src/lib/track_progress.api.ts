import axios from "axios";

const API_URL = "http://localhost:3000/track-progress";

export const getUserStats = async () => {
  const res = await axios.get(`${API_URL}/stats`);
  return res.data;
};

export const getCompletedCourses = async () => {
  const res = await axios.get(`${API_URL}/completed-courses`);
  return res.data;
};

export const getActivity = async () => {
  const res = await axios.get(`${API_URL}/activity`);
  return res.data;
};