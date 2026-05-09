import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  getInterests,
  createInterest,
  updateInterest,
  deleteInterest,
  Interest,
} from "@/lib/interests.api";
import { AddInterestsSheet, InterestFormData } from "./AddInterestsSheet";
import { EditInterestsSheet } from "./EditInterestsSheet";

type UIInterest = {
  id: number;
  name: string;
};

export function InterestsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [interests, setInterests] = useState<UIInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] =
    useState<Interest | null>(null);
  const [interestToDelete, setInterestToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // load data
  useEffect(() => {
    getInterests()
      .then((data: Interest[]) => {
        setInterests(
          data.map((i) => ({
            id: i.interest_id,
            name: i.interest_name,
          })),
        );
      })
      .catch(err => {
        console.error('Failed to load interests:', err);
        setInterests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredInterests = interests.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredInterests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInterests = filteredInterests.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleAddInterest = async (data: Partial<Interest>) => {
    await createInterest({
      interest_name: data.interest_name || "",
    });

    // Reload all interests to maintain correct count and order
    const allInterests = await getInterests();
    setInterests(
      allInterests.map((i) => ({
        id: i.interest_id,
        name: i.interest_name,
      })),
    );
    setCurrentPage(1);
  };

  const handleEditClick = (item: UIInterest) => {
    setSelectedInterest({
      interest_id: item.id,
      interest_name: item.name,
    } as Interest);
    setIsEditSheetOpen(true);
  };

  const handleUpdateInterest = async (updatedItem: Partial<Interest>) => {
    if (!selectedInterest?.interest_id) return;
    const result = await updateInterest(selectedInterest.interest_id, {
      interest_name: updatedItem.interest_name || "",
    });

    setInterests(
      interests.map((i) =>
        i.id === selectedInterest.interest_id
          ? {
              id: result.interest_id,
              name: result.interest_name,
            }
          : i,
      ),
    );
  };

  const handleDelete = async (id: number) => {
    await deleteInterest(id);
    setInterests(interests.filter((item) => item.id !== id));
    setInterestToDelete(null);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Interests</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[200px] pl-9 bg-white"
            />
          </div>
          <Button
            className="gap-2 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white"
            onClick={() => setIsAddSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <AddInterestsSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddInterest}
      />

      <EditInterestsSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateInterest}
        interest={selectedInterest}
      />

      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Interest Name</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">
                Edit
              </TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">
                Delete
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && filteredInterests.length === 0 ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredInterests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  No interests found
                </TableCell>
              </TableRow>
            ) : (
              paginatedInterests.map((item) => (
              <TableRow key={item.id} className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b">
                <TableCell className="font-medium">
                  {item.name}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:text-[#4A5DF9] hover:bg-transparent"
                    onClick={() => handleEditClick(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-transparent hover:text-destructive"
                    onClick={() => setInterestToDelete(item.id)}
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
        {filteredInterests.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB] flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInterests.length)} of {filteredInterests.length}
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
      <Dialog open={interestToDelete !== null} onOpenChange={(open) => !open && setInterestToDelete(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Do you want to delete this interest?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-black hover:text-black" onClick={() => setInterestToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="hover:bg-[#b91c1c]"
              onClick={() => {
                if (interestToDelete !== null) {
                  void handleDelete(interestToDelete);
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





