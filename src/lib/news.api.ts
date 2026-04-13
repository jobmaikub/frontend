import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/news",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface News {
  news_id: number;
  title: string;
  description: string;
  industry_id: number;
  industry?: string; // Full industry object with all fields
  image_url: string;
  source_url: string;
  source_name: string;
  created_at: string;
}

export const getNews = async (): Promise<News[]> => {
  const res = await api.get("/");
  return res.data;
};

export const searchNews = async (query: string, industry?: string): Promise<News[]> => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (industry && industry !== 'All Industries') {
    params.append('industry', industry);
  }
  const res = await api.get(`/search/query?${params.toString()}`);
  return res.data;
};

export const createNews = async (
  data: Partial<News>
): Promise<News> => {
  const res = await api.post("/", data);
  return res.data;
};

export const updateNews = async (
  id: number,
  data: Partial<News>
): Promise<News> => {
  const res = await api.patch(`/${id}`, data);
  return res.data;
};

export const deleteNews = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};
