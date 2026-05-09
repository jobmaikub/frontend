import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Career,
  fetchCareers,
  createCareer,
  updateCareer,
  deleteCareer,
  replaceCareerInterestLinks,
  replaceCareerSkillLinks,
} from "@/lib/careers.api";
import { getIndustries, Industry } from "@/lib/industries.api";
import { getMajors, Major } from "@/lib/majors.api";
import { getSkills, Skill } from "@/lib/skills.api";
import { getInterests, Interest } from "@/lib/interests.api";
import { AddCareerSheet, CareerFormData } from "./AddCareerSheet";
import { EditCareerSheet } from "./EditCareerSheet";
import { useToast } from "@/hooks/use-toast";

export function CareersTable() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [careers, setCareers] = useState<Career[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [careerToDelete, setCareerToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    Promise.all([fetchCareers(), getIndustries(), getMajors(), getSkills(), getInterests()])
      .then(([careersData, industriesData, majorsData, skillsData, interestsData]) => {
        setCareers(Array.isArray(careersData) ? careersData : []);
        setIndustries(Array.isArray(industriesData) ? industriesData : []);
        setMajors(Array.isArray(majorsData) ? majorsData : []);
        setSkills(Array.isArray(skillsData) ? skillsData : []);
        setInterests(Array.isArray(interestsData) ? interestsData : []);
      })
      .catch((err) => console.error("Failed to load careers data:", err))
      .finally(() => setLoading(false));
  }, []);

  const growthRateMap: Record<number, string> = {
    1: "Stable",
    2: "Medium",
    3: "High",
  };

  const getGrowthBadgeClassName = (growth: string) => {
    const normalizedGrowth = growth.toLowerCase();

    if (normalizedGrowth.includes("high")) {
      return "bg-[#E5F7ED] text-[#1FAA52] border-transparent";
    }

    if (normalizedGrowth.includes("medium")) {
      return "bg-[#F0F4FF] text-[#4A5DF9] border-transparent";
    }

    return "bg-gray-100 text-gray-600 border-transparent";
  };

  const filteredCareers = careers.filter(
    (career) =>
      career.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCareers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCareers = filteredCareers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleAddCareer = async (data: CareerFormData) => {
    try {
      const created = await createCareer({
        title: data.title,
        description: data.description,
        industry_id: data.industry_id,
        major_id: data.major_id,
        min_salary: data.min_salary,
        max_salary: data.max_salary,
        growth_rate: Number(data.growth_rate),
        image_url: data.image_url || "",
        required_skills: data.required_skills.split("\n").filter(Boolean),
        responsibilities: data.responsibilities.split("\n").filter(Boolean),
      });
      await Promise.all([
        replaceCareerSkillLinks(created.career_id, data.skill_ids ?? []),
        replaceCareerInterestLinks(created.career_id, data.interest_ids ?? []),
      ]);
      const updated = await fetchCareers();
      setCareers(Array.isArray(updated) ? updated : []);
      setIsAddSheetOpen(false);
      setCurrentPage(1);
    } catch (err) {
      let message = "Failed to add career";
      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as any)?.message ||
          (err.response?.data as any)?.error ||
          err.message ||
          message;
        console.error("Failed to add career:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
      }
      toast({
        title: "Add Career Failed",
        description: String(message),
        variant: "destructive",
      });
      console.error("Failed to add career:", err);
    }
  };

  const handleUpdateCareer = async (data: Partial<Career> & { skill_ids?: number[]; interest_ids?: number[] }) => {
    try {
      const careerId = data.career_id ?? selectedCareer?.career_id;
      if (!careerId) throw new Error("Career ID is required");
      await updateCareer(careerId, {
        title: data.title,
        description: data.description,
        industry_id: data.industry_id,
        major_id: data.major_id,
        min_salary: data.min_salary,
        max_salary: data.max_salary,
        growth_rate: data.growth_rate ? Number(data.growth_rate) : undefined,
        image_url: data.image_url,
        required_skills: data.required_skills,
        responsibilities: data.responsibilities,
      });
      await Promise.all([
        replaceCareerSkillLinks(careerId, data.skill_ids ?? []),
        replaceCareerInterestLinks(careerId, data.interest_ids ?? []),
      ]);
      const updated = await fetchCareers();
      setCareers(Array.isArray(updated) ? updated : []);
      setIsEditSheetOpen(false);
      setSelectedCareer(null);
    } catch (err) {
      let message = "Failed to update career";
      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as any)?.message ||
          (err.response?.data as any)?.error ||
          err.message ||
          message;
        console.error("Failed to update career:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
      }
      toast({
        title: "Update Career Failed",
        description: String(message),
        variant: "destructive",
      });
      console.error("Failed to update career:", err);
    }
  };

  const handleEditClick = (career: Career) => {
    setSelectedCareer(career);
    setIsEditSheetOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCareer(id);
      setCareers((prev) => prev.filter((career) => career.career_id !== id));
      setCurrentPage(1);
      setCareerToDelete(null);
    } catch (err) {
      let message = "Unable to delete this career.";
      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as any)?.message ||
          (err.response?.data as any)?.error ||
          err.message ||
          message;
      }
      toast({
        title: "Delete Career Failed",
        description: String(message),
        variant: "destructive",
      });
      console.error("Failed to delete career:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Career</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 bg-[#FFFFFF]"
            />
          </div>
          <Button
            className="w-full sm:w-auto gap-2 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white shadow-sm"
            onClick={() => setIsAddSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <AddCareerSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddCareer}
        industries={industries}
        majors={majors}
        skills={skills}
        interests={interests}
      />

      <EditCareerSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateCareer}
        career={selectedCareer}
        industries={industries}
        majors={majors}
        skills={skills}
        interests={interests}
      />

      <div className="overflow-x-auto rounded-lg border bg-white">
        <Table className="min-w-[900px] lg:min-w-full">
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Image</TableHead>
              <TableHead className="text-white font-semibold">Career Name</TableHead>
              <TableHead className="text-white font-semibold">Industry</TableHead>
              <TableHead className="text-white font-semibold">Min Salary</TableHead>
              <TableHead className="text-white font-semibold">Growth</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Edit</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && filteredCareers.length === 0 ? (
              // Loading skeleton rows - match actual row height
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell><div className="h-12 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredCareers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No careers found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCareers.map((career) => (
              <TableRow
                key={career.career_id}
                className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
              >
                <TableCell>
                  <div className="h-12 w-20 overflow-hidden rounded-md bg-muted">
                    <img
                      src={career.image_url}
                      alt={career.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{career.title}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground font-medium">
                    {career.industries?.name || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-foreground">
                  {career.min_salary ? career.min_salary.toLocaleString() : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-normal ${getGrowthBadgeClassName(
                      String(growthRateMap[Number(career.growth_rate)] || career.growth_rate || "")
                    )}`}
                  >
                    {growthRateMap[Number(career.growth_rate)] || career.growth_rate || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:text-[#4A5DF9] hover:bg-transparent"
                    onClick={() => handleEditClick(career)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-transparent hover:text-destructive"
                    onClick={() => setCareerToDelete(career.career_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls - Fixed Height */}
        {filteredCareers.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB] flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCareers.length)} of {filteredCareers.length}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <div className="flex items-center justify-center min-w-14 px-2 py-1 rounded border border-gray-300 bg-white font-medium text-sm">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="gap-1 text-xs"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={careerToDelete !== null} onOpenChange={(open) => !open && setCareerToDelete(null)}>
        <DialogContent className="z-50 bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Do you want to delete this career?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-black hover:text-black" onClick={() => setCareerToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="hover:bg-[#b91c1c]"
              onClick={() => {
                if (careerToDelete !== null) {
                  void handleDelete(careerToDelete);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}





