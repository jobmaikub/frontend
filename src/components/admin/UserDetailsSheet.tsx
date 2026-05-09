import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types/users.types";

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onBanToggle: (id: string | number, reason?: string, banUntil?: string) => void;
}

export function UserDetailsSheet({ open, onOpenChange, user, onBanToggle }: UserDetailsSheetProps) {
  const [banReason, setBanReason] = useState("");
  const [banUntilDate, setBanUntilDate] = useState("");
  const [banUntilTime, setBanUntilTime] = useState("");
  if (!user) return null;

  const hasActiveBanHistory = user.banHistory?.some(
    (entry) => !entry.unbanDate || new Date(entry.unbanDate) > new Date()
  );
  const isBanned = Boolean(user.is_banned) || Boolean(hasActiveBanHistory);

  const getDurationLabel = (banDate: string, unbanDate: string | null) => {
    if (!unbanDate) return "Permanent";
    const start = new Date(banDate).getTime();
    const end = new Date(unbanDate).getTime();
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return "-";
    const hours = Math.round((end - start) / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h`;
    const days = Math.round(hours / 24);
    return `${days}d`;
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return "-";
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return value;
    return dt.toLocaleString();
  };

  const getReportStatusBadgeClass = (status?: string) => {
    return status === "resolved"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[600px] overflow-y-auto bg-white border-l shadow-xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">User Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Name <span className="text-destructive">*</span></Label>
              <Input value={user.name} readOnly className="bg-white border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Email <span className="text-destructive">*</span></Label>
              <Input value={user.email} readOnly className="bg-white border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Role <span className="text-destructive">*</span></Label>
              <Input value={user.role} readOnly className="bg-white border-slate-200" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">List User Reports</Label>
            <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
              <Table className="table-fixed min-w-[760px]">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[120px] text-[10px] uppercase font-bold h-9">Report ID</TableHead>
                    <TableHead className="w-[120px] text-[10px] uppercase font-bold h-9">Reporter ID</TableHead>
                    <TableHead className="w-[120px] text-[10px] uppercase font-bold h-9">Offender ID</TableHead>
                    <TableHead className="w-[88px] text-[10px] uppercase font-bold h-9">Status</TableHead>
                    <TableHead className="w-[130px] text-[10px] uppercase font-bold h-9">Last update</TableHead>
                    <TableHead className="w-[220px] text-[10px] uppercase font-bold h-9">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.reports && user.reports.length > 0 ? (
                    user.reports.map((report, idx) => (
                      <TableRow key={idx} className="border-b last:border-0">
                        <TableCell className="text-[10px] py-3 align-top">{report.reportId}</TableCell>
                        <TableCell className="text-[10px] py-3 align-top">{report.reporterId ?? "-"}</TableCell>
                        <TableCell className="text-[10px] py-3 align-top">{report.offenderId}</TableCell>
                        <TableCell className="text-[10px] py-3 align-top">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getReportStatusBadgeClass(report.status)}`}>
                            {report.status ?? "pending"}
                          </span>
                        </TableCell>
                        <TableCell className="text-[10px] py-3 align-top whitespace-normal break-all leading-relaxed">{report.lastUpdate}</TableCell>
                        <TableCell className="text-[10px] py-3 italic align-top">{report.reason}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-[10px] py-3 text-center text-slate-500">
                        No reports for this user
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Ban History</Label>
            <div className="rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
              <Table className="table-fixed min-w-[760px]">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[120px] text-[10px] uppercase font-bold h-9 whitespace-nowrap">Ban ID</TableHead>
                    <TableHead className="w-[130px] text-[10px] uppercase font-bold h-9 whitespace-nowrap">Ban Date</TableHead>
                    <TableHead className="w-[130px] text-[10px] uppercase font-bold h-9 whitespace-nowrap">UnBan Date</TableHead>
                    <TableHead className="w-[80px] text-[10px] uppercase font-bold h-9 whitespace-nowrap">Duration</TableHead>
                    <TableHead className="w-[220px] text-[10px] uppercase font-bold h-9 whitespace-nowrap">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.banHistory && user.banHistory.length > 0 ? (
                    user.banHistory.map((history, idx) => (
                      <TableRow key={idx} className="border-b last:border-0">
                        <TableCell className="text-[10px] py-3 align-top break-all leading-relaxed">{history.banId}</TableCell>
                        <TableCell className="text-[10px] py-3 align-top break-words leading-relaxed">{formatDateTime(history.banDate)}</TableCell>
                        <TableCell className="text-[10px] py-3 align-top break-words leading-relaxed">{formatDateTime(history.unbanDate)}</TableCell>
                        <TableCell className="text-[10px] py-3 align-top leading-relaxed">{getDurationLabel(history.banDate, history.unbanDate)}</TableCell>
                        <TableCell className="text-[10px] py-3 align-top whitespace-pre-wrap break-words leading-relaxed">{history.reason}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-[10px] py-3 text-center text-slate-500">
                        No ban history for this user
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {!isBanned && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Ban Reason</Label>
              <Input
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Reason for banning user"
                className="bg-white border-slate-200"
              />
              <Label className="text-sm font-semibold">Ban Until</Label>
              <div className="grid grid-cols-2 gap-3 w-full">
                <Input
                  type="date"
                  value={banUntilDate}
                  onChange={(e) => setBanUntilDate(e.target.value)}
                  className="bg-white border-slate-200 h-10 text-sm w-full"
                />
                <Input
                  type="time"
                  value={banUntilTime}
                  onChange={(e) => setBanUntilTime(e.target.value)}
                  className="bg-white border-slate-200 h-10 text-sm w-full"
                />
              </div>
            </div>
          )}

          {/* Action Button: Dynamic color and text based on isBanned status */}
          <Button 
            onClick={() => {
              const untilIso = banUntilDate
                ? new Date(`${banUntilDate}T${banUntilTime || "23:59"}`).toISOString()
                : undefined;
              onBanToggle(user.id, banReason, untilIso);
              if (!isBanned) {
                setBanReason("");
                setBanUntilDate("");
                setBanUntilTime("");
              }
            }}
            className={`w-full font-semibold py-6 rounded-lg shadow-md transition-all active:scale-[0.98] ${
              isBanned 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {isBanned ? "Unban User" : "Ban User"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
