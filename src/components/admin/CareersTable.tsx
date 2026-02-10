import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Career } from "@/data/careersData";
import { AddCareerSheet, CareerFormData } from "./AddCareerSheet";
import { EditCareerSheet } from "./EditCareerSheet";

export function CareersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [careers, setCareers] = useState<Career[]>([]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/careers")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((c: any) => ({
          id: c.career_id,
          title: c.title,
          industry: c.industry,
          minSalary: c.min_salary ?? 0,
          growth:
            c.growth_rate === 3 ? "High" :
              c.growth_rate === 2 ? "Medium" : "Stable",
          image: c.image_url,
          interests: c.interest,
          responsibilities: c.responsibilities?.join("\n") ?? "",
          skills: c.required_skills?.join("\n") ?? "",
        }));
        setCareers(mapped);
      });
  }, []);

  const filteredCareers = careers.filter(
    (career) =>
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCareer = async (data: CareerFormData) => {
    const res = await fetch("http://localhost:3000/careers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        industry: data.industry,

        minSalary: data.minSalary ?? 0,
        maxSalary: data.maxSalary ?? 0,
        image: data.image || "",

        growth:
          data.growth === "High" ? 3 :
            data.growth === "Medium" ? 2 : 1,

        interest: data.interests,
        required_skills: data.skills.split("\n"),
        responsibilities: data.responsibilities.split("\n"),
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("POST /careers error:", err);
      return;
    }

    // reload
    const careers = await (await fetch("http://localhost:3000/careers")).json();
    setCareers(
      careers.map((c: any) => ({
        id: c.career_id,
        title: c.title,
        industry: c.industry,
        minSalary: c.min_salary ?? 0,
        growth:
          c.growth_rate === 3 ? "High" :
            c.growth_rate === 2 ? "Medium" : "Stable",
        image: c.image_url,
        interests: c.interest,
        responsibilities: c.responsibilities?.join("\n") ?? "",
        skills: c.required_skills?.join("\n") ?? "",
      }))
    );
  };

  const handleUpdateCareer = async (data: any) => {
    await fetch(`http://localhost:3000/careers/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        industry: data.industry,

        minSalary: data.minSalary,
        maxSalary: data.maxSalary,

        growth:
          data.growth === "High" ? 3 :
            data.growth === "Medium" ? 2 : 1,

        image: data.image,

        interest: data.interests,

        required_skills: data.skills.split("\n"),
        responsibilities: data.responsibilities.split("\n"),

        learningOutcome: data.learningOutcome,
      }),
    });

    // reload list
    const res = await fetch("http://localhost:3000/careers");
    const careers = await res.json();

    setCareers(
      careers.map((c: any) => ({
        id: c.career_id,
        title: c.title,
        industry: c.industry,
        minSalary: c.min_salary ?? 0,
        growth:
          c.growth_rate === 3 ? "High" :
            c.growth_rate === 2 ? "Medium" : "Stable",
        image: c.image_url,
        interests: c.interest,
        responsibilities: c.responsibilities?.join("\n") ?? "",
        skills: c.required_skills?.join("\n") ?? "",
        learningOutcome: c.learning_outcome ?? "",
      }))
    );
  };

  const handleEditClick = (career: Career) => {
    setSelectedCareer(career);
    setIsEditSheetOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3000/careers/${id}`, {
      method: "DELETE",
    });

    setCareers((prev) => prev.filter((career) => career.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Career</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] pl-9 bg-[#FFFFFF]"
            />
          </div>
          <Button
            className="gap-2 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white border-none shadow-sm"
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
      />

      <EditCareerSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateCareer}
        career={selectedCareer}
      />


      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="text-table-header-foreground font-semibold">Image</TableHead>
              <TableHead className="text-table-header-foreground font-semibold">Title</TableHead>
              <TableHead className="text-table-header-foreground font-semibold">Industry</TableHead>
              <TableHead className="text-table-header-foreground font-semibold">Min Salary</TableHead>
              <TableHead className="text-table-header-foreground font-semibold">Growth</TableHead>
              <TableHead className="text-table-header-foreground font-semibold text-center">Edit</TableHead>
              <TableHead className="text-table-header-foreground font-semibold text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCareers.map((career) => (
              <TableRow
                key={career.id}
                className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
              >
                <TableCell>
                  <div className="h-12 w-20 overflow-hidden rounded-md bg-muted">
                    <img
                      src={career.image}
                      alt={career.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{career.title}</TableCell>

                <TableCell>
                  <span className="text-[#4A5DF9] font-medium">
                    {career.industry}
                  </span>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {career.minSalary.toLocaleString()}
                </TableCell>
                <TableCell>
                  {/* UPDATED: Added font-normal to make the text regular weight */}
                  <Badge variant="outline" className="bg-white text-black border-border font-normal">
                    {career.growth}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-transparent"
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
                    onClick={() => handleDelete(career.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}