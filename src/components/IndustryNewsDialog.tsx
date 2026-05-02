import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
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
import { industries as staticIndustries, fetchIndustriesFromDatabase } from '@/lib/news.service';
import type { NewsArticle } from '@/types/careers.types';

interface IndustryNewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: NewsArticle[];
}

const IndustryNewsDialog = ({ open, onOpenChange, news: industryNews }: IndustryNewsDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (newsId: string) => {
    setFailedImages((prev) => new Set(prev).add(newsId));
  };

  const filteredNews = industryNews.filter((news) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      news.title.toLowerCase().includes(searchLower) ||
      (news.description && news.description.toLowerCase().includes(searchLower));
    return matchesSearch;
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
          <DialogDescription className="sr-only">
            Browse the latest news and updates from your industry.
          </DialogDescription>

          {/* Search row */}
          <div className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* News list */}
        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: '55vh' }}>
          <div className="space-y-1">
            {filteredNews.map((news) => (
              <a
                key={news.id}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
            ))}
            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-medium">
                  No news found in database.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please check your "admin.news" table in Supabase.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndustryNewsDialog;
