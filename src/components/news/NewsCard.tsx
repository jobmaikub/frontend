// src/components/news/NewsCard.tsx
import React, { useState } from "react";
import { Bookmark, Clock } from "lucide-react";
import { News } from "@/lib/news.api";

interface NewsCardProps {
  article: News;
}

export default function NewsCard({ article }: NewsCardProps) {
  // State to manage the bookmark click
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
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
            {article.industries?.name || 'Unknown'}
          </span>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`${isBookmarked ? "text-[#4A5DF9]" : "text-gray-400"} hover:text-[#4A5DF9] transition-colors`}
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
            <span>{new Date(article.date).toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}