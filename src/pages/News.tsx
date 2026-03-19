// // src/pages/News.tsx
// import React, { useState, useMemo } from "react";
// import { Navbar } from "@/components/navbar and footer/Navbar";
// import { Footer } from "@/components/navbar and footer/Footer";
// import { Search, Filter, ChevronDown } from "lucide-react";
// import { newsArticles, industries } from "@/components/news/mockData";
// import NewsCard from "@/components/news/NewsCard";

// export default function News() {
//   // Application States
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  
//   // Dropdown UI States
//   const [isIndustryOpen, setIsIndustryOpen] = useState(false);

//   // Filter Logic
//   const filteredArticles = useMemo(() => {
//     return newsArticles.filter((article) => {
//       const matchesSearch = 
//         article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
//         article.description.toLowerCase().includes(searchQuery.toLowerCase());
      
//       const matchesIndustry = 
//         selectedIndustry === "All Industries" || 
//         article.category === selectedIndustry;

//       return matchesSearch && matchesIndustry;
//     });
//   }, [searchQuery, selectedIndustry]);

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       <Navbar />

//       {/* --- HEADER SECTION (White Background) --- */}
//       <section className="w-full flex flex-col items-center pt-32 pb-12 px-4 text-center bg-white">
//         <span className="bg-blue-50 text-blue-500 text-xs font-semibold px-5 py-1.5 rounded-full mb-6">
//           Industry News
//         </span>
//         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
//           Stay Updated
//         </h1>
//         <p className="text-gray-500 text-base md:text-lg max-w-2xl">
//           Latest news and trends from industries matching your interests.
//         </p>
//       </section>

//       {/* --- CONTENT SECTION (Light Gray/Blue Background) --- */}
//       <section className="flex-grow flex flex-col items-center bg-[#F8FAFC] pt-12 pb-24 w-full">
        
//         {/* Search and Filter Bar */}
//         <div className="w-full max-w-[1000px] px-4 mb-10 flex flex-col md:flex-row gap-4">
          
//           {/* Separate Search Box */}
//           <div className="relative flex-grow flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
//             <Search className="absolute left-4 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search careers..."
//               className="w-full pl-11 pr-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg text-sm"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {/* Separate Industry Filter Dropdown */}
//           <div className="relative md:w-[280px]">
//             <button 
//               className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               onClick={() => setIsIndustryOpen(!isIndustryOpen)}
//             >
//               <div className="flex items-center gap-2">
//                 <Filter className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm font-medium">{selectedIndustry}</span>
//               </div>
//               <ChevronDown className="w-4 h-4 text-gray-400" />
//             </button>

//             {/* Dropdown Menu */}
//             {isIndustryOpen && (
//               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-20">
//                 {industries.map((industry) => (
//                   <button
//                     key={industry}
//                     className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
//                     onClick={() => {
//                       setSelectedIndustry(industry);
//                       setIsIndustryOpen(false);
//                     }}
//                   >
//                     {industry}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* News Grid */}
//         <div className="w-full max-w-[1000px] px-4">
//           {filteredArticles.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredArticles.map((article) => (
//                 <NewsCard key={article.id} article={article} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
//               No articles found matching your criteria.
//             </div>
//           )}
//         </div>

//       </section>

//       <Footer />
//     </div>
//   );
// }

// src/pages/News.tsx
import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar and footer/Navbar";
import { Footer } from "@/components/navbar and footer/Footer";
import { Search, Filter, ChevronDown } from "lucide-react";
import { newsArticles, industries } from "@/components/news/mockData";
import NewsCard from "@/components/news/NewsCard";

export default function News() {
  // Application States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  
  // Dropdown UI States
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);

  // Filter Logic
  const filteredArticles = useMemo(() => {
    return newsArticles.filter((article) => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIndustry = 
        selectedIndustry === "All Industries" || 
        article.category === selectedIndustry;

      return matchesSearch && matchesIndustry;
    });
  }, [searchQuery, selectedIndustry]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter']">
      <Navbar />

      {/* --- HEADER SECTION (White Background) --- */}
      <section className="w-full flex flex-col items-center pt-32 pb-12 px-4 text-center bg-white">
        <span className="bg-blue-50 text-[14px] font-normal text-[#4A5DF9] px-5 py-1.5 rounded-full mb-6">
          Industry News
        </span>
        <h1 className="text-[40px] font-semibold text-[#000000] mb-4 tracking-tight">
          Stay Updated
        </h1>
        <p className="text-[18px] font-normal text-[#505050] max-w-2xl">
          Latest news and trends from industries matching your interests.
        </p>
      </section>

      {/* --- CONTENT SECTION (Light Blue Background) --- */}
      <section className="flex-grow flex flex-col items-center bg-[#D5E3FF]/20 pt-12 pb-24 w-full">
        
        {/* Search and Filter Bar */}
        <div className="w-full max-w-[1000px] px-4 mb-10 flex flex-col md:flex-row gap-4">
          
          {/* Separate Search Box */}
          <div className="relative flex-grow flex items-center bg-white rounded-lg border border-gray-200 shadow-sm focus-within:border-[#4A5DF9] transition-colors duration-200">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search careers..."
              className="w-full pl-11 pr-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Separate Industry Filter Dropdown */}
          <div className="relative md:w-[280px]">
            <button 
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsIndustryOpen(!isIndustryOpen)}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{selectedIndustry}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isIndustryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-20">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      setSelectedIndustry(industry);
                      setIsIndustryOpen(false);
                    }}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* News Grid */}
        <div className="w-full max-w-[1000px] px-4">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
              No articles found matching your criteria.
            </div>
          )}
        </div>

      </section>

      <Footer />
    </div>
  );
}