// src/components/news/NewsCard.tsx
import React, { useEffect, useState } from "react";
import { Bookmark, Clock } from "lucide-react";
import { News } from "@/lib/news.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  addNewsBookmark,
  removeNewsBookmark,
} from "@/lib/newsBookmarks";

interface NewsCardProps {
  article: News;
  initiallyBookmarked?: boolean;
  onBookmarkChange?: (updatedBookmarks: News[]) => void;
}

export default function NewsCard({
  article,
  initiallyBookmarked = false,
  onBookmarkChange,
}: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initiallyBookmarked);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    setIsBookmarked(initiallyBookmarked);
  }, [article.news_id, initiallyBookmarked]);

  const handleBookmarkClick = async () => {
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
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full font-['Inter']">
        {/* Image */}
        <div className="h-48 w-full overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-blue-500 text-sm font-medium">
              {article.industries?.name || "Unknown"}
            </span>
            <button
              type="button"
              onClick={handleBookmarkClick}
              className={`${isBookmarked ? "text-[#4A5DF9]" : "text-gray-400"} hover:text-[#4A5DF9] transition-colors`}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              disabled={isMutating}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>

          <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
            {article.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-1">
              {article.source_url ? (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#4A5DF9] hover:text-blue-700 transition-colors truncate max-w-xs"
                >
                  {article.source_name}
                </a>
              ) : (
                <span className="font-medium">{article.source_name}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(article.date).toLocaleDateString("en-GB")}</span>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={isRemoveConfirmOpen} onOpenChange={setIsRemoveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this bookmark?</AlertDialogTitle>
            <AlertDialogDescription>
              This article will be removed from your bookmark list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveBookmark}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}