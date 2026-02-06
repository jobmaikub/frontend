import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AddNewsSheet, NewsFormData } from "./AddNewsSheet";
import { EditNewsSheet } from "./EditNewsSheet";
import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  News,
} from "@/lib/news.api";

export function NewsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  // Sheet state
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // 🔹 Fetch news
  useEffect(() => {
    getNews()
      .then(setNews)
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Search
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.industry).toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Delete
  const handleDelete = async (id: number) => {
    await deleteNews(id);
    setNews((prev) => prev.filter((n) => n.news_id !== id));
  };

  // 🔹 Add
  const handleAddNews = async (data: NewsFormData) => {
    const created = await createNews({
      title: data.title,
      summary: data.summary,
      industry: data.industry,
      image_url: data.imageUrl,
      source_url: data.sourceUrl,
      source_name: data.sourceName,
    });

    setNews((prev) => [created, ...prev]);
  };

  // 🔹 Edit
  const handleEditClick = (item: News) => {
    setSelectedNews(item);
    setIsEditSheetOpen(true);
  };

  const handleUpdateNews = async (data: Partial<News>) => {
    if (!selectedNews) return;

    const result = await updateNews(selectedNews.news_id, data);

    setNews((prev) =>
      prev.map((n) =>
        n.news_id === result.news_id ? result : n
      )
    );

    setIsEditSheetOpen(false);
    setSelectedNews(null);
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading news...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">News</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] pl-9 bg-white"
            />
          </div>

          <Button
            className="gap-2 bg-[#4A5DF9] text-white"
            onClick={() => setIsAddSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      {/* Sheets */}
      <AddNewsSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddNews}
      />

      <EditNewsSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateNews}
        newsItem={selectedNews}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredNews.map((item) => (
              <TableRow key={item.news_id}>
                <TableCell>
                  <img
                    src={item.image_url}
                    className="h-12 w-20 rounded object-cover"
                  />
                </TableCell>

                <TableCell className="font-medium">
                  {item.title}
                </TableCell>

                <TableCell className="text-[#4A5DF9] font-medium">
                  {item.industry}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {item.source_name}
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(item.news_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
