import type { NewsArticle } from '@/types/careers.types';

export type { NewsArticle };

// Fallback industries list (used if API fails)
export const industries = [
  'All Industries',
  'Technology',
  'Marketing',
  'Health',
  'Design & Creative',
  'Finance',
  'Education',
];

// Fetch industry news from database
export async function fetchIndustryNewsFromDatabase(industry?: string): Promise<NewsArticle[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const limit = industry ? 10 : 20;
    const finalUrl = `${apiUrl}/home/industry-news?limit=${limit}${industry ? `&industry=${encodeURIComponent(industry)}` : ''}`;
    const response = await fetch(finalUrl);

    if (!response.ok) {
      console.warn('[news.service] Response not ok:', response.status);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn('[news.service] Data is not an array');
      return [];
    }

    const normalizedData = (data as any[]).map((item) => ({
      ...item,
      id: String(item.news_id || item.id),
      image: item.image_url || item.image,
      source: item.source_name || item.source || 'Industry News',
      url: item.source_url || item.url || '#',
      industry: item.industry || item.industry_name || 'All Industries',
    }));

    return normalizedData.reverse();
  } catch (error: any) {
    console.error('[news.service] Failed to fetch industry news:', error.message || error);
    return [];
  }
}

// Fetch industries from database
export async function fetchIndustriesFromDatabase(): Promise<string[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/home/industries`);

    if (!response.ok) return industries;

    const data = await response.json();
    if (!Array.isArray(data)) return industries;

    const names = data.map((item: any) => item.name);
    return ['All Industries', ...names];
  } catch (error) {
    console.warn('[news.service] Failed to fetch industries:', error);
    return industries;
  }
}
