import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const reviewsApi = axios.create({
  baseURL: API_BASE_URL + "/reviews",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===== CREATE REVIEW ===== */
export async function createReview(data: {
  career_id: number;
  user_id: string;
  author: string;
  rating: number;
  comment: string;
}) {
  const res = await reviewsApi.post("/", data);
  return res.data;
}

/* ===== GET REVIEWS BY CAREER ===== */
export async function getReviewsByCareer(careerId: number) {
  const res = await reviewsApi.get("/", {
    params: { career_id: careerId },
  });
  return res.data;
}

/* ===== GET ALL REVIEWS ===== */
export async function getAllReviews() {
  const res = await reviewsApi.get("/");
  return res.data;
}

/* ===== GET REVIEW BY ID ===== */
export async function getReviewById(id: number) {
  const res = await reviewsApi.get(`/${id}`);
  return res.data;
}

/* ===== UPDATE REVIEW ===== */
export async function updateReview(
  id: number,
  data: {
    rating?: number;
    comment?: string;
  }
) {
  const res = await reviewsApi.patch(`/${id}`, data);
  return res.data;
}

/* ===== DELETE REVIEW ===== */
export async function deleteReview(id: number) {
  const res = await reviewsApi.delete(`/${id}`);
  return res.data;
}

/* ===== ADD LIKE ===== */
export async function addLike(id: number) {
  const res = await reviewsApi.patch(`/${id}/like`);
  return res.data;
}

/* ===== ADD REPLY TO REVIEW ===== */
export async function addReply(
  parentReviewId: number,
  data: {
    user_id: string;
    author: string;
    comment: string;
    rating?: number;
  }
) {
  const res = await reviewsApi.post(`/${parentReviewId}/replies`, data);
  return res.data;
}
