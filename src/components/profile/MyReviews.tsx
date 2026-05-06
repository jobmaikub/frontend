import { Star, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

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
          {reviews.map((review) => (
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
      </div>

      {!!editingReview && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setEditingReview(null)}
        />
      )}

      <Dialog modal={false} open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent className="z-50" onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
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
        <DialogContent className="z-50" onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this review?</p>
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

