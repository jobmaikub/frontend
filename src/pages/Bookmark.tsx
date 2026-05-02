import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/navbar and footer/Navbar";
import { Footer } from "@/components/navbar and footer/Footer";
import { Search, Filter, ChevronDown, BookmarkX, Loader } from "lucide-react";
import NewsCard from "@/components/news/NewsCard";
import type { News } from "@/lib/news.api";
import { getBookmarkedNews } from "@/lib/newsBookmarks.api";

export default function Bookmark() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
	const [isIndustryOpen, setIsIndustryOpen] = useState(false);
	const [bookmarkedArticles, setBookmarkedArticles] = useState<News[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const reloadBookmarks = async () => {
		try {
			setLoading(true);
			setError(null);
			const bookmarkedNews = await getBookmarkedNews();
			setBookmarkedArticles(bookmarkedNews);
		} catch (err) {
			console.error("Error loading bookmarks:", err);
			setError("Failed to load bookmarked news");
			setBookmarkedArticles([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		reloadBookmarks();
	}, []);

	const industries = useMemo(() => {
		const industriesSet = new Set<string>();
		bookmarkedArticles.forEach((article) => {
			if (article.industries?.name) {
				industriesSet.add(article.industries.name);
			}
		});

		return ["All Industries", ...Array.from(industriesSet).sort()];
	}, [bookmarkedArticles]);

	const filteredArticles = useMemo(() => {
		return bookmarkedArticles.filter((article) => {
			const matchesSearch =
				article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				article.description.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesIndustry =
				selectedIndustry === "All Industries" ||
				article.industries?.name === selectedIndustry;

			return matchesSearch && matchesIndustry;
		});
	}, [bookmarkedArticles, searchQuery, selectedIndustry]);

	return (
		<div className="min-h-screen flex flex-col bg-white font-['Inter']">
			<Navbar />

			<section className="w-full flex flex-col items-center pt-32 pb-12 px-4 text-center bg-white">
				<span className="bg-blue-50 text-[14px] font-normal text-[#4A5DF9] px-5 py-1.5 rounded-full mb-6">
					Saved News
				</span>
				<h1 className="text-[40px] font-semibold text-[#000000] mb-4 tracking-tight">
					Your Bookmarks
				</h1>
				<p className="text-[18px] font-normal text-[#505050] max-w-2xl">
					Revisit the articles you saved. Latest bookmarked items appear first.
				</p>
			</section>

			<section className="flex-grow flex flex-col items-center bg-[#D5E3FF]/20 pt-12 pb-24 w-full">
				<div className="w-full max-w-[1000px] px-4 mb-10 flex flex-col md:flex-row gap-4">
					<div className="relative flex-grow flex items-center bg-white rounded-lg border border-gray-200 shadow-sm focus-within:border-[#4A5DF9] transition-colors duration-200">
						<Search className="absolute left-4 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Search bookmarked news..."
							className="w-full pl-11 pr-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg text-sm"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="relative md:w-[280px]">
						<button
							type="button"
							className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
							onClick={() => setIsIndustryOpen(!isIndustryOpen)}
						>
							<div className="flex items-center gap-2">
								<Filter className="w-4 h-4 text-gray-400" />
								<span className="text-sm font-medium">{selectedIndustry}</span>
							</div>
							<ChevronDown className="w-4 h-4 text-gray-400" />
						</button>

						{isIndustryOpen && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-20">
								{industries.map((industry) => (
									<button
										type="button"
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

				<div className="w-full max-w-[1000px] px-4">
					{loading ? (
						<div className="text-center py-20">
							<div className="flex justify-center items-center mb-4">
								<Loader className="w-8 h-8 text-[#4A5DF9] animate-spin" />
							</div>
							<p className="text-gray-500">Loading bookmarked news...</p>
						</div>
					) : error ? (
						<div className="text-center py-20 text-red-500 bg-white rounded-xl border border-red-200">
							{error}
						</div>
					) : filteredArticles.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredArticles.map((article) => (
								<NewsCard
									key={article.news_id}
									article={article}
									initiallyBookmarked
									onBookmarkChange={(updatedBookmarks) => {
										setBookmarkedArticles(updatedBookmarks);
									}}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200 flex flex-col items-center gap-3">
							<BookmarkX className="w-7 h-7 text-gray-400" />
							<p>No bookmarked articles found.</p>
						</div>
					)}
				</div>
			</section>

			<Footer />
		</div>
	);
}
