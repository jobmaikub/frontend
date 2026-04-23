import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, FileText, Image as ImageIcon } from 'lucide-react';
import { industries, type NewsArticle } from '@/data/mockData';

interface IndustryNewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: NewsArticle[];
}

const IndustryNewsDialog = ({ open, onOpenChange, news: industryNews }: IndustryNewsDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (newsId: string) => {
    setFailedImages((prev) => new Set(prev).add(newsId));
  };

  const filteredNews = industryNews.filter((news) => {
    const matchesSearch = news.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesIndustry =
      selectedIndustry === 'All Industries' ||
      news.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0 gap-0 overflow-hidden bg-popover">
        {/* Header */}
        <div className="p-6 pb-4 pr-12">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <FileText className="h-6 w-6 text-primary" />
            Industry News
          </DialogTitle>

          {/* Search + Filter row */}
          <div className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search faculties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[200px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* News list */}
        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: '55vh' }}>
          <div className="space-y-1">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                {/* Image or Placeholder */}
                {!failedImages.has(news.id) && news.image ? (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-16 w-20 rounded-lg object-cover flex-shrink-0"
                    loading="lazy"
                    onError={() => handleImageError(news.id)}
                  />
                ) : (
                  <div className="h-16 w-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-card-foreground">
                    {news.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {news.description}
                  </p>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {news.source}
                  </span>
                </div>
              </div>
            ))}
            {filteredNews.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No news found matching your criteria.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndustryNewsDialog;
