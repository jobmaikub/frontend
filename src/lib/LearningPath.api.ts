import axios from "axios";

const API = "/api/learning-paths";

// 🔹 ใส่ user จริง (หรือดึงจาก auth ภายหลัง)
const USER_ID = "6b9560eb-8970-47ae-a5fc-81f5a7e96b98";

// 🔹 helper
const extractArray = (res: any) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const handleError = (error: any) => {
  console.error("API ERROR:", error);

  if (error?.response?.data?.message) {
    throw new Error(error.response.data.message);
  }

  throw new Error("Something went wrong");
};

// 🔹 GET ALL PATHS (ต้องมี userId)
export const getLearningPaths = async () => {
  try {
    const res = await axios.get(
      `${API}/user/${USER_ID}`
    );

    return extractArray(res.data);
  } catch (error) {
    handleError(error);
    return [];
  }
};

// 🔹 GET DETAIL
export const getLearningPathDetail = async (
  id: number
) => {
  try {
    const res = await axios.get(
      `${API}/user/${USER_ID}/${id}`
    );

    if (!res.data) {
      throw new Error("No data received");
    }

    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};