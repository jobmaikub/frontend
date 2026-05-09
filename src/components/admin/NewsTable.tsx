import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { getIndustries, Industry } from "@/lib/industries.api";

export function NewsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<News[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  // Sheet state
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔹 Fetch news and industries
  useEffect(() => {
    Promise.all([getNews(), getIndustries()])
      .then(([newsData, industriesData]) => {
        setNews(Array.isArray(newsData) ? newsData : []);
        setIndustries(Array.isArray(industriesData) ? industriesData : []);
      })
      .catch(() => {
        setNews([]);
        setIndustries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Search
  const filteredNews = news.filter(
    (item) => {
      const searchLower = searchQuery.toLowerCase();
      const itemDate = (item.created_at || item.date || "").split("T")[0]; // Extract YYYY-MM-DD

      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.industries?.name?.toLowerCase().includes(searchLower) ||
        item.source_name.toLowerCase().includes(searchLower) ||
        itemDate.includes(searchLower) // Search by date (YYYY-MM-DD format)
      );
    }
  );

  // 🔹 Sort by date (newest first)
  const sortedNews = [...filteredNews].sort((a, b) => {
    const dateA = new Date(a.created_at || a.date || 0).getTime();
    const dateB = new Date(b.created_at || b.date || 0).getTime();
    return dateB - dateA; // Newest first
  });

  // Pagination
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = sortedNews.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getIndustryNameById = (industryId?: number) => {
    if (!industryId) return undefined;
    const found = industries.find((i) => i.industry_id === industryId);
    if (!found) return undefined;
    return found.name || found.industry_name || "";
  };

  // 🔹 Delete
  const handleDelete = async (id: number) => {
    await deleteNews(id);
    setNews((prev) => prev.filter((n) => n.news_id !== id));
    setNewsToDelete(null);
    setCurrentPage(1);
  };

  // 🔹 Add
  const handleAddNews = async (data: NewsFormData) => {
    const created = await createNews({
      title: data.title,
      description: data.description,
      industry_id: data.industry_id,
      image_url: data.image_url,
      source_url: data.source_url,
      source_name: data.source_name,
      date: data.date,
    });

    const createdIndustryName = getIndustryNameById(created.industry_id ?? data.industry_id);
    const createdWithIndustry = {
      ...created,
      industries: created.industries || (createdIndustryName
        ? {
          industry_id: created.industry_id ?? data.industry_id ?? 0,
          name: createdIndustryName,
        }
        : undefined),
    };

    setNews((prev) => [createdWithIndustry, ...prev]);
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
    const updatedIndustryName = getIndustryNameById(result.industry_id ?? data.industry_id);

    setNews((prev) =>
      prev.map((n) =>
        n.news_id === result.news_id
          ? {
            ...result,
            industries: result.industries || (updatedIndustryName
              ? {
                industry_id: result.industry_id ?? data.industry_id ?? 0,
                name: updatedIndustryName,
              }
              : n.industries),
          }
          : n
      )
    );

    setIsEditSheetOpen(false);
    setSelectedNews(null);
    setCurrentPage(1);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">News</h1>

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
        industries={industries}
      />

      <EditNewsSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateNews}
        news={selectedNews}
        industries={industries}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
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

                  <TableCell className="font-medium text-foreground">
                    {item.title}
                  </TableCell>

                  <TableCell className="text-muted-foreground font-medium">
                    {item.industries?.name || "N/A"}
                  </TableCell>

                  <TableCell className="text-foreground min-w-[120px]">
                    {(item.created_at || item.date) ? new Date(item.created_at || item.date || "").toLocaleDateString('sv-SE') : "N/A"}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {item.source_name}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-600 hover:text-[#4A5DF9] hover:bg-transparent"
                      onClick={() => handleEditClick(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-transparent hover:text-destructive"
                      onClick={() => setNewsToDelete(item.news_id)}
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
      <Dialog open={newsToDelete !== null} onOpenChange={(open) => !open && setNewsToDelete(null)}>
        <DialogContent className="z-50 bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Do you want to delete this news item?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-black hover:text-black" onClick={() => setNewsToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="hover:bg-[#b91c1c]"
              onClick={() => {
                if (newsToDelete !== null) {
                  void handleDelete(newsToDelete);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}





