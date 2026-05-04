import { createAuthenticatedApi } from "./apiClient";

export const reviewsApi = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/reviews"
);

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
export async function getReviewsByCareer(careerId: number, userId?: string) {
  const res = await reviewsApi.get("/", {
    params: { 
      career_id: careerId,
      user_id: userId
    },
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

/* ===== TOGGLE LIKE ===== */
export async function addLike(id: number, userId: string) {
  const res = await reviewsApi.patch(`/${id}/like`, { userId });
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
/* ===== REPORT REVIEW ===== */
export async function reportReview(
  id: number,
  data: {
    userId: string;
    reportType: string;
    reason?: string;
  }
) {
  const res = await reviewsApi.post(`/${id}/report`, data);
  return res.data;
}
