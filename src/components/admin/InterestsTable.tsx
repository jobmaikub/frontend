import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] =
    useState<UIInterest | null>(null);

  // load data
  useEffect(() => {
    getInterests().then((data: Interest[]) => {
      setInterests(
        data.map((i) => ({
          id: i.interest_id,
          name: i.interest_name,
        })),
      );
    });
  }, []);

  const filteredInterests = interests.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddInterest = async (data: InterestFormData) => {
    const result = await createInterest({
      interest_name: data.name,
    });

    setInterests([
      {
        id: result.interest_id,
        name: result.interest_name,
      },
      ...interests,
    ]);
  };

  const handleEditClick = (item: UIInterest) => {
    setSelectedInterest(item);
    setIsEditSheetOpen(true);
  };

  const handleUpdateInterest = async (updatedItem: UIInterest) => {
    const result = await updateInterest(updatedItem.id, {
      interest_name: updatedItem.name,
    });

    setInterests(
      interests.map((i) =>
        i.id === updatedItem.id
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
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Interests</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px] pl-9 bg-white"
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

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Interest Name</TableHead>
              <TableHead className="text-center w-[100px]">
                Edit
              </TableHead>
              <TableHead className="text-center w-[100px]">
                Delete
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterests.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.name}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(item.id)}
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
