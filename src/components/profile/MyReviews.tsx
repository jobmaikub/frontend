import { Star, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

export interface Review {
  id: string;
  rating: number;
  author: string;
  text: string;
  career: string;
  careerPath: string;
  date?: string;
  parentReviewId?: number | null;
}

interface MyReviewsProps {
  reviews: Review[];
  onEdit: (id: string, text: string, rating: number) => void;
  onDelete: (id: string) => void;
}

const StarRating = ({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i <= rating ? "fill-warning text-warning" : "text-muted"} ${onChange ? "cursor-pointer" : ""}`}
        onClick={() => onChange?.(i)}
      />
    ))}
  </div>
);

const MyReviews = ({ reviews, onEdit, onDelete }: MyReviewsProps) => {
  const navigate = useNavigate();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStartEdit = (review: Review) => {
    setEditingReview(review);
    setEditText(review.text);
    setEditRating(review.rating);
  };

  const handleSaveEdit = () => {
    if (editingReview) {
      onEdit(editingReview.id, editText, editRating);
      setEditingReview(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">My Reviews</h3>
        </div>

         <div className="divide-y divide-border">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="group p-6 transition-colors hover:bg-accent/30 cursor-pointer"
              onClick={() => navigate(review.careerPath)}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!review.parentReviewId ? (
                      <StarRating rating={review.rating} />
                    ) : (
                      <span className="text-xs font-bold text-primary/70 bg-primary/5 px-2 py-0.5 rounded">Reply</span>
                    )}
                    {review.date && (
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    )}
                  </div>

                  <div className="flex gap-1 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStartEdit(review); }}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(review.id); }}
                      className="rounded-md p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm leading-relaxed text-foreground/90 font-medium italic">
                    "{review.text}"
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                    <span className="text-muted-foreground">Reviewed for:</span>
                    {review.career}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm text-muted-foreground">No reviews yet</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 pb-10 sm:pb-4 border-t border-border flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-colors border border-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const maxVisible = 3;
                const halfWindow = Math.floor(maxVisible / 2);

                let startPage = Math.max(1, currentPage - halfWindow);
                let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                if (endPage - startPage + 1 < maxVisible) {
                  startPage = Math.max(1, endPage - maxVisible + 1);
                }

                if (startPage > 1) {
                  pages.push(1);
                  if (startPage > 2) pages.push('...');
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) pages.push('...');
                  pages.push(totalPages);
                }

                return pages.map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-slate-300 text-xs">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all",
                        currentPage === page
                          ? "bg-primary text-white shadow-md"
                          : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      {page}
                    </button>
                  )
                );
              })()}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-colors border border-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {!!editingReview && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setEditingReview(null)}
        />
      )}

      <Dialog modal={false} open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto z-50" onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription className="sr-only">
              Edit your career review text and rating.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!editingReview?.parentReviewId && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Rating</label>
                <StarRating rating={editRating} onChange={setEditRating} />
              </div>
            )}
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingReview(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!!deleteId && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setDeleteId(null)}
        />
      )}

      <Dialog modal={false} open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto z-50" onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyReviews;

