import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AdminUserReportRow,
  fetchReports,
  resolveAndBanReport,
} from "@/lib/users.api";
import { useAuth } from "@/contexts/AuthContexts";

export function ReportsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<AdminUserReportRow[]>([]);
  const [statusSort, setStatusSort] = useState<"all" | "pending-first" | "resolved-first">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<AdminUserReportRow | null>(null);
  const [isResolveSheetOpen, setIsResolveSheetOpen] = useState(false);
  const [sheetBanReason, setSheetBanReason] = useState("");
  const [sheetBanUntilDate, setSheetBanUntilDate] = useState("");
  const [sheetBanUntilTime, setSheetBanUntilTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);
  const { user: authUser } = useAuth();
  const itemsPerPage = 10;

  const loadReports = async () => {
    try {
      setError(null);
      const rows = await fetchReports();
      setReports(rows);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const processedReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let filtered = reports;

    if (q) {
      filtered = reports.filter((report) => {
        const reportId = String(report.report_id ?? "").toLowerCase();
        const reporterId = String(report.by_user_id ?? "").toLowerCase();
        const offenderId = String(report.report_user_id ?? "").toLowerCase();
        const reportType = String(report.report_type ?? "").toLowerCase();
        const reason = String(report.reason ?? "").toLowerCase();

        return (
          reportId.includes(q) ||
          reporterId.includes(q) ||
          offenderId.includes(q) ||
          reportType.includes(q) ||
          reason.includes(q)
        );
      });
    }

    if (statusSort === "all") {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const aPending = a.status === "pending" ? 1 : 0;
      const bPending = b.status === "pending" ? 1 : 0;
      return statusSort === "pending-first" ? bPending - aPending : aPending - bPending;
    });
  }, [reports, searchQuery, statusSort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusSort]);

  const handleOpenResolveSheet = (report: AdminUserReportRow) => {
    setSelectedReport(report);
    setSheetBanReason("");
    setSheetBanUntilDate("");
    setSheetBanUntilTime("");
    setIsResolveSheetOpen(true);
  };

  const handleCloseResolveSheet = (open: boolean) => {
    setIsResolveSheetOpen(open);
    if (!open) {
      setSelectedReport(null);
      setSheetBanReason("");
      setSheetBanUntilDate("");
      setSheetBanUntilTime("");
    }
  };

  const handleResolveAndBan = async () => {
    if (!selectedReport) {
      return;
    }

    const report = selectedReport;

    if (report.status !== "pending") {
      return;
    }

    if (!authUser?.id) {
      setError("Cannot resolve report: missing admin user id");
      return;
    }

    try {
      setActionLoadingId(report.report_id);
      const banUntilIso = sheetBanUntilDate
        ? new Date(`${sheetBanUntilDate}T${sheetBanUntilTime || "23:59"}`).toISOString()
        : undefined;

      const result = await resolveAndBanReport({
        reportId: report.report_id,
        resolvedBy: authUser.id,
        resolutionNote: `Resolved and banned by admin from report ${report.report_id}`,
        banReason: sheetBanReason.trim() || "Banned by admin after moderation review",
        banUntil: banUntilIso,
      });

      const resolvedIds = new Set(result.resolved_report_ids ?? []);
      const fallbackOffenderId = result.report_user_id ?? report.report_user_id;
      const nowIso = new Date().toISOString();

      setReports((prev) =>
        prev.map((row) =>
          (
            resolvedIds.size > 0
              ? resolvedIds.has(row.report_id)
              : row.report_user_id === fallbackOffenderId && row.status === "pending"
          )
            ? {
              ...row,
              status: "resolved",
              updated_at: result.report.updated_at ?? nowIso,
              resolved_at: result.report.resolved_at ?? nowIso,
              resolved_by: result.report.resolved_by ?? authUser.id,
              resolution_note: result.report.resolution_note,
            }
            : row
        )
      );
      handleCloseResolveSheet(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to resolve and ban");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === "resolved"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";
  };

  const filteredReports = processedReports;
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const offenderReports = useMemo(() => {
    if (!selectedReport) return [] as AdminUserReportRow[];

    return reports
      .filter((row) => row.report_user_id === selectedReport.report_user_id)
      .sort((a, b) => {
        const aPending = a.status === "pending" ? 1 : 0;
        const bPending = b.status === "pending" ? 1 : 0;

        if (aPending !== bPending) {
          return bPending - aPending;
        }

        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [reports, selectedReport]);

  const offenderPendingCount = offenderReports.filter((r) => r.status === "pending").length;
  const offenderResolvedCount = offenderReports.filter((r) => r.status === "resolved").length;
  const offenderUniqueReporterCount = new Set(offenderReports.map((r) => r.by_user_id)).size;

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatDateTime = (value: string) => {
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return value;
    return dt.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports</h1>

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
              className="w-full h-11 pl-10 bg-white rounded-xl border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-[#4A5DF9] focus-visible:border-[#4A5DF9]"
            />
          </div>
          <div className="relative">
            <Select
              open={isStatusSelectOpen}
              onOpenChange={setIsStatusSelectOpen}
              value={statusSort === "all" ? undefined : statusSort}
              onValueChange={(value: "all" | "pending-first" | "resolved-first") => setStatusSort(value)}
            >
              <SelectTrigger className="w-full sm:w-[170px] bg-[#FFFFFF]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#FFFFFF]">
                <SelectItem value="pending-first">Pending First</SelectItem>
                <SelectItem value="resolved-first">Resolved First</SelectItem>
                <SelectItem value="all">All Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <Table className="min-w-[1000px] lg:min-w-full">
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Report ID</TableHead>
              <TableHead className="text-white font-semibold">Reporter ID</TableHead>
              <TableHead className="text-white font-semibold">Offender ID</TableHead>
              <TableHead className="text-white font-semibold">Category</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Date</TableHead>
              <TableHead className="text-white font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                  <TableCell><div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-28"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : paginatedReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              paginatedReports.map((report) => (
                <TableRow
                  key={report.report_id}
                  className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
                >
                  <TableCell className="text-muted-foreground">{report.report_id}</TableCell>
                  <TableCell className="text-foreground">{report.by_user_id}</TableCell>
                  <TableCell className="text-muted-foreground">{report.report_user_id}</TableCell>
                  <TableCell className="text-foreground">{report.report_type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(report.status)}`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(report.created_at)}</TableCell>
                  <TableCell className="text-center">
                    {report.status === "pending" ? (
                      <Button
                        className="bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white h-8 px-4 text-xs rounded-md shadow-none"
                        disabled={actionLoadingId === report.report_id}
                        onClick={() => handleOpenResolveSheet(report)}
                      >
                        Resolve
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Already resolved</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && filteredReports.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB]">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of {filteredReports.length}
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

      {/* Side Sheet Components */}
      <Sheet open={isResolveSheetOpen} onOpenChange={handleCloseResolveSheet}>
        <SheetContent className="w-full sm:w-[560px] overflow-y-auto bg-white border-l shadow-xl">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl font-semibold">Resolve Report + Ban User</SheetTitle>
          </SheetHeader>

          {selectedReport && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="text-sm font-semibold">Report ID</Label>
                  <Input value={selectedReport.report_id} readOnly className="bg-white mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Reporter ID</Label>
                  <Input value={selectedReport.by_user_id} readOnly className="bg-white mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Offender ID</Label>
                  <Input value={selectedReport.report_user_id} readOnly className="bg-white mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Report Type</Label>
                  <Input value={selectedReport.report_type || "-"} readOnly className="bg-white mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Report Reason</Label>
                  <div className="mt-1 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700 whitespace-pre-wrap break-words max-h-28 overflow-y-auto">
                    {selectedReport.reason || "-"}
                  </div>
                </div>
                {selectedReport.review_id && (
                  <div className="pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2 border-[#4A5DF9] text-[#4A5DF9] hover:bg-[#4A5DF9]/10"
                      onClick={() => {
                        const careerId = selectedReport.review?.career_id;
                        if (careerId) {
                          window.open(`/careers/${careerId}#review-${selectedReport.review_id}`, '_blank');
                        } else {
                          // Fallback
                          window.open(`/reviews/${selectedReport.review_id}`, '_blank');
                        }
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Reported Review
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Related Reports For This Offender</Label>
                <div className="text-xs text-slate-600">
                  Total {offenderReports.length} | Pending {offenderPendingCount} | Resolved {offenderResolvedCount} | Unique Reporters {offenderUniqueReporterCount}
                </div>
                <div className="max-h-64 overflow-auto rounded-md border border-slate-200 bg-white">
                  <Table className="table-fixed min-w-[760px]">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="w-[120px] text-[10px] uppercase font-bold h-9">Report ID</TableHead>
                        <TableHead className="w-[120px] text-[10px] uppercase font-bold h-9">Reporter ID</TableHead>
                        <TableHead className="w-[88px] text-[10px] uppercase font-bold h-9">Status</TableHead>
                        <TableHead className="w-[130px] text-[10px] uppercase font-bold h-9">Last Update</TableHead>
                        <TableHead className="w-[80px] text-[10px] uppercase font-bold h-9">Type</TableHead>
                        <TableHead className="w-[220px] text-[10px] uppercase font-bold h-9">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offenderReports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-xs text-slate-500 py-3">
                            No related reports found
                          </TableCell>
                        </TableRow>
                      ) : (
                        offenderReports.map((row) => (
                          <TableRow key={row.report_id}>
                            <TableCell className="text-[10px] py-2 align-top truncate" title={row.report_id}>{row.report_id}</TableCell>
                            <TableCell className="text-[10px] py-2 align-top whitespace-normal break-all leading-relaxed">{row.by_user_id}</TableCell>
                            <TableCell className="text-[10px] py-2 align-top">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(row.status)}`}>
                                {row.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-[10px] py-2 align-top">{formatDateTime(row.updated_at || row.created_at)}</TableCell>
                            <TableCell className="text-[10px] py-2 align-top">{row.report_type || "-"}</TableCell>
                            <TableCell className="text-[10px] py-2 align-top whitespace-pre-wrap break-words leading-relaxed">
                              {row.reason || "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Ban Reason</Label>
                <Input
                  value={sheetBanReason}
                  onChange={(e) => setSheetBanReason(e.target.value)}
                  placeholder="Enter moderation reason"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Ban Until (optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    value={sheetBanUntilDate}
                    onChange={(e) => setSheetBanUntilDate(e.target.value)}
                    className="bg-white"
                  />
                  <Input
                    type="time"
                    value={sheetBanUntilTime}
                    onChange={(e) => setSheetBanUntilTime(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>


              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-white hover:bg-slate-100 text-black hover:text-black"
                  onClick={() => handleCloseResolveSheet(false)}
                  disabled={actionLoadingId === selectedReport.report_id}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white"
                  onClick={handleResolveAndBan}
                  disabled={actionLoadingId === selectedReport.report_id}
                >
                  {actionLoadingId === selectedReport.report_id ? "Processing..." : "Confirm"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}




