// src/components/ReportsTable.tsx

import { useState } from "react";
import { Search, Plus, Eye } from "lucide-react";
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
import { reportsData, Report } from "@/data/reportsData";

export function ReportsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<Report[]>(reportsData);

  // Filter logic for searching by Report ID or Reporter ID
  const filteredReports = reports.filter(
    (report) =>
      report.id.toString().includes(searchQuery) ||
      report.reporterId.includes(searchQuery) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        
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
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            {/* Custom Blue Header matching image_13966d.png */}
            <TableRow className="bg-[#4A5DF9] hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Report ID</TableHead>
              <TableHead className="text-white font-semibold">Reporter ID</TableHead>
              <TableHead className="text-white font-semibold">Offender ID</TableHead>
              <TableHead className="text-white font-semibold">Category</TableHead>
              <TableHead className="text-white font-semibold">Date</TableHead>
              <TableHead className="text-white font-semibold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow 
                key={report.id} 
                className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
              >
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.reporterId}</TableCell>
                <TableCell>{report.offenderId}</TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell className="text-muted-foreground">{report.date}</TableCell>
                <TableCell className="text-center">
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-[#4A5DF9] hover:bg-transparent text-sm font-normal"
                    onClick={() => console.log("Show details for report:", report.id)}
                  >
                    Show Report Details
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