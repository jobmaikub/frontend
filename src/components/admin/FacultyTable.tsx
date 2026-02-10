// import { useState } from "react";
// import { Search, Plus, Pencil, Trash2 } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { facultiesData, Faculty } from "@/data/facultiesData";

// export function FacultyTable() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [faculties, setFaculties] = useState<Faculty[]>(facultiesData);

//   const filteredFaculties = faculties.filter(
//     (f) =>
//       f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       f.thaiName.includes(searchQuery)
//   );

//   const handleDelete = (id: number) => {
//     setFaculties(faculties.filter((f) => f.id !== id));
//   };
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <h1 className="text-3xl font-bold text-foreground">Faculties</h1>

//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               /* UPDATED: White background FFFFFF */
//               className="w-[200px] pl-9 bg-[#FFFFFF]"
//             />
//           </div>
//           <Button 
//             /* UPDATED: Blue background 4A5DF9 */
//             className="gap-2 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white border-none"
//           >
//             <Plus className="h-4 w-4" />
//             Add New
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-lg border border-border">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-table-header hover:bg-table-header">
//               <TableHead className="text-white font-semibold">Name</TableHead>
//               <TableHead className="text-white font-semibold">Thai Name</TableHead>
//               <TableHead className="text-white font-semibold">Color</TableHead>
//               <TableHead className="text-white font-semibold text-center">Edit</TableHead>
//               <TableHead className="text-white font-semibold text-center">Delete</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {filteredFaculties.map((f) => (
//               <TableRow 
//                 key={f.id}
//                 className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
//               >
//                 <TableCell className="font-medium">{f.name}</TableCell>
//                 <TableCell>{f.thaiName}</TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <div 
//                       className="h-3 w-3 rounded-full border border-black/10" 
//                       style={{ backgroundColor: f.color }} 
//                     />
//                     <span className="font-mono text-xs uppercase">{f.color}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-center">
//                    <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-primary"
//                   >
//                     <Pencil className="h-4 w-4" />
//                   </Button>
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-destructive hover:bg-transparent hover:text-destructive"
//                     onClick={() => handleDelete(f.id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

"use client";

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
  Faculty,
  getFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "@/lib/faculties.api";

import { AddFacultySheet, FacultyFormData } from "./AddFacultySheet";
import { EditFacultySheet } from "./EditFacultySheet";

export function FacultyTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  useEffect(() => {
    getFaculties()
      .then(setFaculties)
      .finally(() => setLoading(false));
  }, []);

  const filteredFaculties = faculties.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFaculty = async (data: FacultyFormData) => {
    const created = await createFaculty({ name: data.name });
    setFaculties((prev) => [created, ...prev]);
  };

  const handleEditClick = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsEditSheetOpen(true);
  };

  const handleUpdateFaculty = async (updated: Faculty) => {
    const result = await updateFaculty(updated.faculty_id, {
      name: updated.name,
    });

    setFaculties((prev) =>
      prev.map((f) =>
        f.faculty_id === result.faculty_id ? result : f
      )
    );
  };

  const handleDelete = async (id: number) => {
    await deleteFaculty(id);
    setFaculties((prev) =>
      prev.filter((f) => f.faculty_id !== id)
    );
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading faculties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Faculties</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] pl-9 bg-white"
            />
          </div>

          <Button
            className="gap-2 bg-[#4A5DF9] text-white"
            onClick={() => setIsAddSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <AddFacultySheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddFaculty}
      />

      <EditFacultySheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateFaculty}
        faculty={selectedFaculty}
      />

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Faculty Name</TableHead>
              <TableHead className="text-center w-[100px]">Edit</TableHead>
              <TableHead className="text-center w-[100px]">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredFaculties.map((f) => (
              <TableRow key={f.faculty_id}>
                <TableCell className="font-medium">{f.name}</TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(f)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(f.faculty_id)}
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
