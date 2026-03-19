// // src/components/news/NewsCard.tsx
// import React from "react";
// import { Bookmark, Clock } from "lucide-react";
// import { NewsArticle } from "./mockData";

// interface NewsCardProps {
//   article: NewsArticle;
// }

// export default function NewsCard({ article }: NewsCardProps) {
//   return (
//     <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
//       {/* Image */}
//       <div className="h-48 w-full overflow-hidden">
//         <img 
//           src={article.imageUrl} 
//           alt={article.title} 
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Content */}
//       <div className="p-6 flex flex-col flex-grow">
//         <div className="flex justify-between items-center mb-3">
//           <span className="text-blue-500 text-sm font-medium">
//             {article.category}
//           </span>
//           <button className="text-gray-400 hover:text-gray-600 transition-colors">
//             <Bookmark className="w-4 h-4" />
//           </button>
//         </div>

//         <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
//           {article.title}
//         </h3>
        
//         <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
//           {article.description}
//         </p>

//         {/* Footer */}
//         <div className="flex items-center text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
//           <span className="font-medium mr-3">{article.source}</span>
//           <div className="flex items-center gap-1">
//             <Clock className="w-3 h-3" />
//             <span>{article.date}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/news/NewsCard.tsx
import React, { useState } from "react";
import { Bookmark, Clock } from "lucide-react";
import { NewsArticle } from "./mockData";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  // State to manage the bookmark click
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full font-['Inter']">
      {/* Image */}
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-blue-500 text-sm font-medium">
            {article.category}
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
        <div className="flex items-center text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
          <span className="font-medium mr-3">{article.source}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}