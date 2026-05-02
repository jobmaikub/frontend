      {/* เก่า */}
import { useState, useEffect } from 'react'
import { Star, Heart, MoreVertical, ChevronDown } from 'lucide-react'
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
import { toast } from 'sonner'
import * as reviewsApi from '@/lib/reviews.api'

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
          className={`${px} ${
            i <= rating ? 'fill-star text-star' : 'text-star-muted'
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
}: {
  review: Review
  isReply?: boolean
  currentUserId: string
  likedReviewIds: Set<string>
  onLike: (id: string, isLiking: boolean) => void
  onReply: (parentId: string, text: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, text: string) => void
}) => {
  const [showReplies, setShowReplies] = useState(false)
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
      toast.error('Could not update like')
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
      <div className={isReply ? 'ml-12 mt-3' : 'border-b border-border pb-4'}>
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {review.author.charAt(0)}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm">
                  {review.author}
                </span>

                {!isReply && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                )}

                {isReply && (
                  <span className="text-xs text-muted-foreground">
                    {review.date}
                  </span>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-muted rounded">
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
              <p className="mt-2 text-sm">{review.comment}</p>
            )}

            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 ${
                  isLiked ? 'text-red-500' : 'hover:text-primary'
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
                  onClick={() => setReplying(!replying)}
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
                  className={`h-3 w-3 transition-transform ${
                    showReplies ? 'rotate-180' : ''
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
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRM */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this comment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDelete(review.id)
                toast.success('Comment deleted')
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* REPORT */}
      <Dialog open={openReport} onOpenChange={setOpenReport}>
        <DialogContent className="max-w-md">
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
                className={`w-full text-left px-3 py-2 rounded border ${
                  reportReason === reason
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted'
                }`}
              >
                {reason}
              </button>
            ))}

            {reportReason === 'Other' && (
              <Textarea
                placeholder="Please describe the issue..."
                value={reportOther}
                onChange={(e) => setReportOther(e.target.value)}
              />
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
              onClick={() => {
                toast.success('Report submitted')
                setOpenReport(false)
                setReportReason('')
                setReportOther('')
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
  const [reviewList, setReviewList] = useState<Review[]>(initialReviews)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')
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
        toast.error('Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }
    
    fetchReviews()
  }, [careerId])

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
    if (sortBy === 'newest') {
      return Number(b.id) - Number(a.id)
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
      toast.success('Review deleted')
    } catch (error) {
      console.error('Failed to delete review:', error)
      toast.error('Failed to delete review')
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
      toast.success('Review updated')
    } catch (error) {
      console.error('Failed to update review:', error)
      toast.error('Failed to update review')
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
      toast.success('Reply sent')
    } catch (error) {
      console.error('Failed to add reply:', error)
      toast.error('Failed to add reply')
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
      toast.success('Review submitted successfully!')
      setUserRating(0)
      setReviewText('')
    } catch (error: any) {
      console.error('Failed to submit review:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review'
      console.error('Backend error:', errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex gap-8">
        <div className="text-center">
          <div className="text-5xl font-bold">
            {avgRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(avgRating)} />
          <p className="text-sm text-muted-foreground mt-1">
            {reviewList.length} Reviews
          </p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className="w-3 text-sm text-muted-foreground">{s}</span>
              <div className="flex-1 h-2.5 bg-muted rounded-full">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${(ratingCounts[i] / maxCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review */}
      <div>
        <h4 className="font-semibold mb-2">Write a Review</h4>

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
          className="mt-3"
        />

        <Button
          onClick={handleSubmitReview}
          disabled={!userRating || !reviewText.trim() || loading}
          className="mt-3"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>

      {/* Review List */}
      <div>
        <div className="flex justify-between mb-4">
          <h4 className="font-semibold">All Reviews</h4>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
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
            sortedReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                currentUserId={userId}
                likedReviewIds={likedReviewIds}
                onLike={handleToggleLike}
                onReply={handleAddReply}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewSection