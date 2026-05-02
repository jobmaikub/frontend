import { createAuthenticatedApi } from "./apiClient";
import type { News } from "@/lib/news.api";

const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/bookmarks"
);

export const getBookmarkedNews = async (): Promise<News[]> => {
  const res = await api.get("/");
  return res.data;
};

export const addNewsBookmark = async (newsId: number): Promise<News[]> => {
  const res = await api.post(`/${newsId}`);
  return res.data;
};

export const removeNewsBookmark = async (newsId: number): Promise<News[]> => {
  const res = await api.delete(`/${newsId}`);
  return res.data;
};
