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
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-foreground">My Reviews</h3>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group relative rounded-lg bg-accent/50 p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(review.careerPath)}
                >
                  <StarRating rating={review.rating} />
                  <p className="mt-1 text-sm font-semibold text-foreground">{review.author}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{review.text}</p>
                  <p className="mt-1 text-xs text-primary">: {review.career}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStartEdit(review); }}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(review.id); }}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">ยังไม่มีรีวิว</p>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขรีวิว</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">คะแนน</label>
              <StarRating rating={editRating} onChange={setEditRating} />
            </div>
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingReview(null)}>ยกเลิก</Button>
            <Button onClick={handleSaveEdit}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">คุณต้องการลบรีวิวนี้ใช่หรือไม่?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>ลบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyReviews;
