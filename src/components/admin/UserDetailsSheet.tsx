import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { User } from "@/data/usersData";

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onBanToggle: (id: number) => void; // New prop
}

export function UserDetailsSheet({ open, onOpenChange, user, onBanToggle }: UserDetailsSheetProps) {
  if (!user) return null;

  const isBanned = user.banHistory && user.banHistory.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto bg-white border-l shadow-xl">
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
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-[10px] uppercase font-bold h-10">Report ID</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold h-10">Offender ID</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold h-10">Last update</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold h-10">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.reports?.map((report, idx) => (
                    <TableRow key={idx} className="border-b last:border-0">
                      <TableCell className="text-[10px] py-3">{report.reportId}</TableCell>
                      <TableCell className="text-[10px] py-3">{report.offenderId}</TableCell>
                      <TableCell className="text-[10px] py-3">{report.lastUpdate}</TableCell>
                      <TableCell className="text-[10px] py-3 italic">{report.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Ban History</Label>
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-[10px] uppercase font-bold h-10">Ban ID</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold h-10">Ban Date</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold h-10">UnBan Date</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold h-10">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.banHistory?.map((history, idx) => (
                    <TableRow key={idx} className="border-b last:border-0">
                      <TableCell className="text-[10px] py-3">{history.banId}</TableCell>
                      <TableCell className="text-[10px] py-3">{history.banDate}</TableCell>
                      <TableCell className="text-[10px] py-3">{history.unbanDate}</TableCell>
                      <TableCell className="text-[10px] py-3">{history.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Action Button: Dynamic color and text based on isBanned status */}
          <Button 
            onClick={() => onBanToggle(user.id)}
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