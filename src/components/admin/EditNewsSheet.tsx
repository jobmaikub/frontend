import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { News, updateNews } from "@/lib/news.api";
import { getIndustries, Industry } from "@/lib/industries.api";


interface EditNewsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: News) => Promise<void> | void;
  news: News | null;
}

export function EditNewsSheet({
  open,
  onOpenChange,
  onSubmit,
  news,
}: EditNewsSheetProps) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    industry_id: undefined as number | undefined,
    image_url: "",
    source_url: "",
    source_name: "",
  });

  useEffect(() => {
    getIndustries().then((industries: Industry[]) => {
      setIndustries(industries);
    });
  }, []);

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        summary: news.summary || "",
        industry_id: news.industry_id,
        image_url: news.image_url || "",
        source_url: news.source_url || "",
        source_name: news.source_name || "",
      });
    }
  }, [news]);

  const isValid =
    formData.title.trim().length > 0 && formData.summary.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !news) return;

    try {
      await updateNews(news.news_id, {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        industry_id: formData.industry_id,
        image_url: formData.image_url.trim(),
        source_url: formData.source_url.trim(),
        source_name: formData.source_name.trim(),
      });

      onOpenChange(false);
      await onSubmit({
        ...news,
        title: formData.title,
        summary: formData.summary,
        industry_id: formData.industry_id,
        image_url: formData.image_url,
        source_url: formData.source_url,
        source_name: formData.source_name,
      });
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Edit News</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-summary">
              Summary <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-summary"
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="min-h-[100px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-industry">Industry</Label>
            <select
              id="edit-industry"
              value={formData.industry_id || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  industry_id: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="">Select Industry (Optional)</option>
              {industries.map((ind) => (
                <option key={ind.industry_id} value={ind.industry_id}>
                  {ind.industry_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image">
              Image URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-image"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-source-url">Source URL</Label>
            <Input
              id="edit-source-url"
              value={formData.source_url}
              onChange={(e) =>
                setFormData({ ...formData, source_url: e.target.value })
              }
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-source-name">Source Name</Label>
            <Input
              id="edit-source-name"
              value={formData.source_name}
              onChange={(e) =>
                setFormData({ ...formData, source_name: e.target.value })
              }
              className="bg-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="flex-1 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white"
            >
              Update
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
