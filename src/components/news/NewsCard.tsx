// src/components/news/NewsCard.tsx
import React, { useEffect, useState } from "react";
import { Bookmark, Clock } from "lucide-react";
import { News } from "@/lib/news.api";
import { useAuth } from "@/contexts/AuthContexts";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  addNewsBookmark,
  removeNewsBookmark,
} from "@/lib/newsBookmarks.api";

interface NewsCardProps {
  article: News;
  initiallyBookmarked?: boolean;
  onBookmarkChange?: (updatedBookmarks: News[]) => void;
}

const DEFAULT_NEWS_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop";

export default function NewsCard({
  article,
  initiallyBookmarked = false,
  onBookmarkChange,
}: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initiallyBookmarked);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsBookmarked(initiallyBookmarked);
  }, [article.news_id, initiallyBookmarked]);

  const handleBookmarkClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isMutating) {
      return;
    }

    if (isBookmarked) {
      setIsRemoveConfirmOpen(true);
      return;
    }

    setIsBookmarked(true);
    setIsMutating(true);

    try {
      const updatedBookmarks = await addNewsBookmark(article.news_id);
      onBookmarkChange?.(updatedBookmarks);
    } catch (error) {
      setIsBookmarked(false);
      console.error("Failed to add bookmark:", error);
    } finally {
      setIsMutating(false);
    }
  };

  const confirmRemoveBookmark = async () => {
    if (isMutating) {
      return;
    }

    setIsBookmarked(false);
    setIsRemoveConfirmOpen(false);
    setIsMutating(true);

    try {
      const updatedBookmarks = await removeNewsBookmark(article.news_id);
      onBookmarkChange?.(updatedBookmarks);
    } catch (error) {
      setIsBookmarked(true);
      console.error("Failed to remove bookmark:", error);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <>
      <div
        onClick={() => article.source_url && window.open(article.source_url, '_blank')}
        className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full font-['Inter'] transform-gpu"
      >
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted/20 transform-gpu">
          <img
            src={article.image_url && article.image_url !== "null" ? article.image_url : DEFAULT_NEWS_IMAGE}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_NEWS_IMAGE;
            }}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-[#4A5DF9] px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm">
              {article.industries?.name || "News"}
            </span>
          </div>

          {/* Bookmark Button Overlay */}
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleBookmarkClick(); }}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all hover:scale-110 active:scale-95 ${isBookmarked ? "text-[#4A5DF9]" : "text-gray-400"} hover:text-[#4A5DF9]`}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              disabled={isMutating}
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 transition-colors">
              {article.title}
            </h3>
          </div>

          <div className="flex-grow mb-6 overflow-hidden">
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {article.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-1">
              <span className="font-medium text-[#4A5DF9] group-hover:text-blue-700 transition-colors">
                {article.source_name}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(article.date).toLocaleDateString("en-GB")}</span>
            </div>
          </div>
        </div>
      </div>

      {isRemoveConfirmOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setIsRemoveConfirmOpen(false)}
        />
      )}

      <Dialog modal={false} open={isRemoveConfirmOpen} onOpenChange={setIsRemoveConfirmOpen}>
        <DialogContent
          className="z-50"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Remove this bookmark?</DialogTitle>
            <DialogDescription>
              This article will be removed from your bookmark list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmRemoveBookmark}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
