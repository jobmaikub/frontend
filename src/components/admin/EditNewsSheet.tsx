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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { News } from "@/lib/news.api";
import { Industry } from "@/lib/industries.api";


interface EditNewsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<News>) => Promise<void> | void;
  news: News | null;
  industries: Industry[];
}

export function EditNewsSheet({
  open,
  onOpenChange,
  onSubmit,
  news,
  industries,
}: EditNewsSheetProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    industry_id: undefined as number | undefined,
    image_url: "",
    source_url: "",
    source_name: "",
    date: "",
  });

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        description: news.description || "",
        industry_id: news.industry_id,
        image_url: news.image_url || "",
        source_url: news.source_url || "",
        source_name: news.source_name || "",
        date: (news.date || "").split("T")[0],
      });
    }
  }, [news, industries]);

  const isValid =
    formData.title.trim().length > 0 && formData.description.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !news) return;

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        industry_id: formData.industry_id,
        image_url: formData.image_url.trim(),
        source_url: formData.source_url.trim(),
        source_name: formData.source_name.trim(),
        date: formData.date,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto bg-white">
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
            <Label htmlFor="edit-description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[100px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-industry">Industry</Label>
            <Select
              value={formData.industry_id ? formData.industry_id.toString() : ""}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  industry_id: v ? Number(v) : undefined,
                })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Industry (Optional)" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {industries?.map((ind) => (
                  <SelectItem
                    key={ind.industry_id}
                    value={ind.industry_id.toString()}
                  >
                    {ind.name || ind.industry_name || `Industry ${ind.industry_id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date">Publish Date <span className="text-destructive">*</span></Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className="bg-white"
            />
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
        </form>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-white hover:bg-slate-100 text-black hover:text-black"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!isValid}
            className="flex-1 bg-[#4A5DF9] hover:bg-[#3945CC] text-white"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
