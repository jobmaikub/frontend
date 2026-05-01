import { createAuthenticatedApi } from "./apiClient";

export const api = createAuthenticatedApi(
  import.meta.env.VITE_API_URL + "/admin/news"
);

export interface News {
  news_id: number;
  title: string;
  description: string;
  industry_id?: number;
  image_url: string;
  source_url: string;
  source_name: string;
  date: string;
  created_at?: string;
  industries?: {
    industry_id: number;
    name: string;
  };
}

const sortNewsByDateDesc = (articles: News[]): News[] => {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getNews = async (): Promise<News[]> => {
  const res = await api.get("/");
  return sortNewsByDateDesc(res.data);
};

export const searchNews = async (query: string, industry?: string): Promise<News[]> => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (industry && industry !== 'All Industries') {
    params.append('industry', industry);
  }
  const res = await api.get(`/search/query?${params.toString()}`);
  return sortNewsByDateDesc(res.data);
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
