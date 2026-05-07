{/* เก่า */ }
import { useState, useEffect, useRef } from 'react'
import { Star, Heart, MoreVertical, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Review } from '@/types/careers.types'
import Toast, { ToastType } from './Toast'
import * as reviewsApi from '@/lib/reviews.api'
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

/* ---------------- STAR RATING ---------------- */

const StarRating = ({
  rating,
  size = 'sm',
  interactive,
  onRate,
}: {
  rating: number
  size?: 'sm' | 'lg'
  interactive?: boolean
  onRate?: (r: number) => void
}) => {
  const px = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${px} ${i <= rating ? 'fill-star text-star' : 'text-star-muted'
            } ${interactive ? 'cursor-pointer hover:text-star' : ''}`}
          onClick={() => interactive && onRate?.(i)}
        />
      ))}
    </div>
  )
}

/* ---------------- REVIEW ITEM ---------------- */

const ReviewItem = ({
  review,
  isReply,
  currentUserId,
  likedReviewIds,
  onLike,
  onReply,
  onDelete,
  onUpdate,
  onNotify,
  initialExpanded,
}: {
  review: Review
  isReply?: boolean
  currentUserId: string
  likedReviewIds: Set<string>
  onLike: (id: string, isLiking: boolean) => void
  onReply: (parentId: string, text: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, text: string) => void
  onNotify: (message: string, type: ToastType) => void
  initialExpanded?: boolean
}) => {
  const navigate = useNavigate()
  const [showReplies, setShowReplies] = useState(initialExpanded || false)
  const [likes, setLikes] = useState(review.likes)
  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState('')

  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(review.comment)

  const [openDelete, setOpenDelete] = useState(false)
  const [openReport, setOpenReport] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportOther, setReportOther] = useState('')

  // Enhanced owner check
  const isOwner = String(review.userId) === String(currentUserId) || (review.userId === undefined && review.author === 'You')
  const isLiked = likedReviewIds.has(String(review.id))

  const handleLike = async () => {
    if (!currentUserId) {
      onNotify('Please login to like reviews', 'error')
      return
    }
    try {
      const newIsLiking = !isLiked
      // Update parent state first
      onLike(String(review.id), newIsLiking)
      // Update local like count
      setLikes((prev) => (newIsLiking ? prev + 1 : prev - 1))

      // Call API
      await reviewsApi.addLike(Number(review.id), currentUserId)
    } catch (error) {
      // Rollback
      onLike(String(review.id), isLiked)
      setLikes(likes)
      onNotify('Could not update like', 'error')
    }
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return
    onReply(review.id, replyText)
    setReplyText('')
    setReplying(false)
    setShowReplies(true)
  }

  const handleSaveEdit = () => {
    if (!editText.trim()) return
    onUpdate(String(review.id), editText)
    setEditing(false)
  }

  return (
    <>
      <div id={`review-${review.id}`} className={cn(
        "transition-all duration-500 scroll-mt-24 py-2 rounded-lg",
        isReply ? 'mt-2 bg-muted/5' : 'px-2 sm:px-4 border-b border-border pb-4'
      )}>
        <div className={cn("flex items-start gap-2 sm:gap-3", isReply && "pl-2 pr-0 sm:pl-4")}>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0"
            style={{ cursor: review.userId && String(review.userId) !== String(currentUserId) ? 'pointer' : 'default' }}
            onClick={() => {
              if (review.userId && String(review.userId) !== String(currentUserId)) {
                navigate(`/profile/${review.userId}`);
              }
            }}
            title={String(review.userId) !== String(currentUserId) ? `View ${review.author}'s profile` : undefined}
          >
            {review.author.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span
                  className={cn(
                    "font-semibold text-sm",
                    review.userId && String(review.userId) !== String(currentUserId)
                      ? 'cursor-pointer hover:text-primary hover:underline transition-colors'
                      : ''
                  )}
                  onClick={() => {
                    if (review.userId && String(review.userId) !== String(currentUserId)) {
                      navigate(`/profile/${review.userId}`);
                    }
                  }}
                >
                  {review.author}
                </span>

                {isReply && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {review.date}
                  </span>
                )}

                {!isReply && (
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-0.5 sm:mt-0">
                    <StarRating rating={review.rating} />
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                )}
              </div>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 hover:bg-muted rounded-full transition-colors shrink-0 -mr-1">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {isOwner ? (
                    <>
                      <DropdownMenuItem onClick={() => setEditing(true)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                        Delete
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => setOpenReport(true)}>
                      Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* COMMENT / EDIT MODE */}
            {editing ? (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="text-sm min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-1.5 text-sm text-foreground/90 leading-relaxed break-words">{review.comment}</p>
            )}

            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'hover:text-primary'
                  }`}
              >
                <Heart
                  className="h-3.5 w-3.5"
                  fill={isLiked ? 'currentColor' : 'none'}
                />
                {likes}
              </button>

              {!isReply && (
                <button
                  onClick={() => {
                    if (!currentUserId) {
                      onNotify('Please login to reply', 'error')
                      return
                    }
                    setReplying(!replying)
                  }}
                  className="hover:text-primary"
                >
                  Reply
                </button>
              )}
            </div>

            {replying && (
              <div className="mt-3">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                />
                <Button size="sm" className="mt-2" onClick={handleSendReply}>
                  Send
                </Button>
              </div>
            )}

            {review.replies && review.replies.length > 0 && !isReply && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                {showReplies ? 'Hide' : review.replies.length} replies
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${showReplies ? 'rotate-180' : ''
                    }`}
                />
              </button>
            )}

            {/* Use CSS to hide/show to preserve internal component state (like the heart) */}
            <div className={showReplies ? 'block' : 'hidden'}>
              {review.replies?.map((reply) => (
                <ReviewItem
                  key={reply.id}
                  review={reply}
                  isReply
                  currentUserId={currentUserId}
                  likedReviewIds={likedReviewIds}
                  onLike={onLike}
                  onReply={onReply}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onNotify={onNotify}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {openDelete && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpenDelete(false)}
        />
      )}

      <Dialog modal={false} open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent
          className="z-50"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              Delete this comment?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(review.id)
                onNotify('Comment deleted', 'success')
                setOpenDelete(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {openReport && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpenReport(false)}
        />
      )}

      <Dialog modal={false} open={openReport} onOpenChange={setOpenReport}>
        <DialogContent
          className="max-w-md z-50"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Report Comment</DialogTitle>
            <DialogDescription className="sr-only">
              Please select a reason for reporting this comment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 mt-2">
            {[
              'Spam',
              'Harassment',
              'Inappropriate content',
              'False information',
              'Other',
            ].map((reason) => (
              <button
                key={reason}
                onClick={() => setReportReason(reason)}
                className={`w-full text-left px-3 py-2 rounded border ${reportReason === reason
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-muted'
                  }`}
              >
                {reason}
              </button>
            ))}

            {reportReason && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                <Textarea
                  placeholder={
                    reportReason === 'Other'
                      ? "Please describe the issue..."
                      : `Tell us more about this ${reportReason.toLowerCase()}...`
                  }
                  value={reportOther}
                  onChange={(e) => setReportOther(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenReport(false)}>
              Cancel
            </Button>
            <Button
              disabled={
                !reportReason ||
                (reportReason === 'Other' && !reportOther.trim())
              }
              onClick={async () => {
                try {
                  await reviewsApi.reportReview(Number(review.id), {
                    userId: currentUserId,
                    reportType: reportReason, // Selected reason (e.g., "Spam")
                    reason: reportOther,     // Additional details
                  })
                  onNotify('Report submitted successfully', 'success')
                  setOpenReport(false)
                  setReportReason('')
                  setReportOther('')
                } catch (error: any) {
                  console.error('Failed to submit report:', error)
                  if (error.response?.data) {
                    console.error('Backend Error Details:', error.response.data)
                  }
                  onNotify(error.response?.data?.message || 'Failed to submit report. Please try again.', 'error')
                }
              }}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ---------------- REVIEW SECTION ---------------- */

interface ReviewSectionProps {
  reviews?: Review[]
  careerId: number
  userId: string
  userName?: string
}

const ReviewSection = ({ reviews: initialReviews = [], careerId, userId, userName: propUserName }: ReviewSectionProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [reviewList, setReviewList] = useState<Review[]>(initialReviews)
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'popular'>('recent')
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [userRating, setUserRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState(propUserName || 'Anonymous')

  // Track liked reviews
  const [likedReviewIds, setLikedReviewIds] = useState<Set<string>>(new Set())

  const handleToggleLike = (id: string, isLiking: boolean) => {
    setLikedReviewIds(prev => {
      const next = new Set(prev)
      if (isLiking) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const handleNotify = (message: string, type: ToastType) => {
    setToast({ message, type })
  }

  useEffect(() => {
    if (propUserName) {
      setUserName(propUserName)
    }
  }, [propUserName])

  // Fetch reviews from API on mount or when careerId changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const data = await reviewsApi.getReviewsByCareer(careerId, userId)
        setReviewList(data)

        // Initialize liked state from database
        const likedIds = new Set<string>()
        data.forEach((r: any) => {
          if (r.isLikedByMe) likedIds.add(String(r.id))
          r.replies?.forEach((rep: any) => {
            if (rep.isLikedByMe) likedIds.add(String(rep.id))
          })
        })
        setLikedReviewIds(likedIds)
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
        handleNotify('Failed to load reviews', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [careerId])

  // Handle auto-scroll to review if hash exists
  useEffect(() => {
    if (!loading && reviewList.length > 0 && window.location.hash) {
      const hash = window.location.hash;
      if (hash.startsWith('#review-')) {
        // Short delay to ensure DOM is updated
        setTimeout(() => {
          const element = document.getElementById(hash.slice(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a brief highlight effect
            element.classList.add('highlight-comment');
            setTimeout(() => element.classList.remove('highlight-comment'), 3000);
          }
        }, 300);
      }
    }
  }, [loading, reviewList]);

  const isSubmitDisabled =
    userRating === 0 || reviewText.trim() === ''

  const avgRating =
    reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + r.rating, 0) /
      reviewList.length
      : 0

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (r) => reviewList.filter((rev) => rev.rating === r).length
  )
  const maxCount = Math.max(...ratingCounts, 1)

  const sortedReviews = [...reviewList].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    }
    if (sortBy === 'oldest') {
      return Number(a.id) - Number(b.id)
    }
    return (b.likes || 0) - (a.likes || 0)
  })

  const handleDelete = async (id: string) => {
    try {
      await reviewsApi.deleteReview(Number(id))

      const deleteRecursive = (list: Review[]): Review[] =>
        list
          .filter((item) => String(item.id) !== String(id))
          .map((item) => ({
            ...item,
            replies: item.replies
              ? deleteRecursive(item.replies)
              : [],
          }))

      setReviewList((prev) => deleteRecursive(prev))
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] })
      handleNotify('Review deleted', 'success')
    } catch (error) {
      console.error('Failed to delete review:', error)
      handleNotify('Failed to delete review', 'error')
    }
  }

  const handleUpdate = async (id: string, text: string) => {
    try {
      await reviewsApi.updateReview(Number(id), { comment: text })

      const updateRecursive = (list: Review[]): Review[] =>
        list.map((item) => {
          if (String(item.id) === String(id)) {
            return { ...item, comment: text }
          }
          if (item.replies) {
            return { ...item, replies: updateRecursive(item.replies) }
          }
          return item
        })

      setReviewList((prev) => updateRecursive(prev))
      handleNotify('Review updated', 'success')
    } catch (error) {
      console.error('Failed to update review:', error)
      handleNotify('Failed to update review', 'error')
    }
  }

  const handleAddReply = async (parentId: string, text: string) => {
    try {
      const newReply = await reviewsApi.addReply(Number(parentId), {
        user_id: userId,
        author: userName,
        comment: text,
      })

      const addReplyRecursive = (list: Review[]): Review[] =>
        list.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              replies: [...(item.replies || []), newReply],
            }
          }
          if (item.replies) {
            return {
              ...item,
              replies: addReplyRecursive(item.replies),
            }
          }
          return item
        })

      setReviewList((prev) => addReplyRecursive(prev))
      handleNotify('Reply sent', 'success')
    } catch (error) {
      console.error('Failed to add reply:', error)
      handleNotify('Failed to add reply', 'error')
    }
  }

  const handleSubmitReview = async () => {
    if (isSubmitDisabled) return

    try {
      const newReview = await reviewsApi.createReview({
        career_id: careerId,
        user_id: userId,
        author: userName,
        rating: userRating,
        comment: reviewText,
      })

      setReviewList((prev) => [newReview, ...prev])
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] })
      handleNotify('Review submitted successfully!', 'success')
      setUserRating(0)
      setReviewText('')
    } catch (error: any) {
      console.error('Failed to submit review:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review'
      console.error('Backend error:', errorMessage)
      handleNotify(errorMessage, 'error')
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start bg-muted/20 p-6 rounded-2xl">
        <div className="text-center shrink-0">
          <div className="text-5xl sm:text-6xl font-bold text-primary">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex justify-center mt-1">
            <StarRating rating={Math.round(avgRating)} />
          </div>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {reviewList.length} Reviews
          </p>
        </div>

        <div className="flex-1 w-full max-w-[300px] space-y-2">
          {[5, 4, 3, 2, 1].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span className="w-3 text-xs font-medium text-muted-foreground">{s}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${(ratingCounts[i] / (maxCount || 1)) * 100}%`,
                  }}
                />
              </div>
              <span className="w-6 text-[10px] text-muted-foreground text-right">{ratingCounts[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review */}
      <div className="bg-muted/30 rounded-2xl p-4 sm:p-6 border border-dashed border-border/60">
        {userId ? (
          <>
            <h4 className="font-semibold text-base mb-3">Write a Review</h4>
            <StarRating
              rating={userRating}
              size="lg"
              interactive
              onRate={setUserRating}
            />
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              className="mt-3 bg-card"
            />
            <Button
              onClick={handleSubmitReview}
              disabled={!userRating || !reviewText.trim() || loading}
              className="mt-3"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <h4 className="font-semibold mb-2">Want to share your experience?</h4>
            <p className="text-sm text-muted-foreground mb-4">Please login to write a review, like comments, or reply.</p>
            <Button onClick={() => navigate('/login')} variant="outline" className="gap-2">
              Login to Review
            </Button>
          </div>
        )}
      </div>

      {/* Review List */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h4 className="font-semibold text-base">All Reviews</h4>
          <div className="relative shrink-0" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center justify-between min-w-[110px] h-9 px-3 py-2 text-xs font-medium bg-white border border-input rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <span className="capitalize">{sortBy}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 transition-transform duration-200", isSortOpen && "rotate-180")} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                {(['recent', 'oldest', 'popular'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors capitalize",
                      sortBy === option ? "text-primary font-semibold bg-primary/5" : "text-gray-600"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {loading && reviewList.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Loading reviews...
            </p>
          ) : sortedReviews.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            sortedReviews.map((review) => {
              const isTargetOrHasTarget = window.location.hash === `#review-${review.id}` ||
                review.replies?.some(r => `#review-${r.id}` === window.location.hash);

              return (
                <ReviewItem
                  key={review.id}
                  review={review}
                  currentUserId={userId}
                  likedReviewIds={likedReviewIds}
                  onLike={handleToggleLike}
                  onReply={handleAddReply}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onNotify={handleNotify}
                  initialExpanded={isTargetOrHasTarget}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewSection
