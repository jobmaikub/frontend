import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔹 Fetch news
  useEffect(() => {
    getNews()
      .then((data) => {
        console.log("📰 News Data with Industries:", data);
        setNews(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to load news:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Search
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.industries?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // 🔹 Delete
  const handleDelete = async (id: number) => {
    await deleteNews(id);
    setNews((prev) => prev.filter((n) => n.news_id !== id));
    setCurrentPage(1);
  };

  // 🔹 Add
  const handleAddNews = async (data: NewsFormData) => {
    const created = await createNews({
      title: data.title,
      summary: data.summary,
      industry_id: data.industry_id,
      image_url: data.image_url,
      source_url: data.source_url,
      source_name: data.source_name,
    });

    setNews((prev) => [created, ...prev]);
    setCurrentPage(1);
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
    setCurrentPage(1);
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
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
        news={selectedNews}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#4A5DF9] hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Image</TableHead>
              <TableHead className="text-white font-semibold">News Name</TableHead>
              <TableHead className="text-white font-semibold">Industry</TableHead>
              <TableHead className="text-white font-semibold">Date</TableHead>
              <TableHead className="text-white font-semibold">Source</TableHead>
              <TableHead className="text-white font-semibold text-center">Edit</TableHead>
              <TableHead className="text-white font-semibold text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && filteredNews.length === 0 ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell><div className="h-12 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-28"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredNews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No news found
                </TableCell>
              </TableRow>
            ) : (
              paginatedNews.map((item) => (
              <TableRow key={item.news_id} className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b">
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
                  {item.industries?.name || "N/A"}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {item.source_name}
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[#4A5DF9] hover:text-white"
                    onClick={() => handleEditClick(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-[#4A5DF9] hover:text-white"
                    onClick={() => handleDelete(item.news_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls - Fixed Height */}
        {filteredNews.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB] flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredNews.length)} of {filteredNews.length}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <div className="flex items-center justify-center min-w-14 px-2 py-1 rounded border border-gray-300 bg-white font-medium text-sm">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="gap-1 text-xs"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
