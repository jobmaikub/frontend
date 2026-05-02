import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

const CELL_SIZE = 10;  // px width/height of each dot
const CELL_GAP = 2;    // px gap between dots
const CELL_STEP = CELL_SIZE + CELL_GAP; // = 12px per column
const FONT_SIZE = 11;  // px — font ขนาดคงเดิม

function getLevel(count: number) {
  if (count === 0) return "bg-[hsl(var(--heatmap-0))]";
  if (count <= 2) return "bg-[hsl(var(--heatmap-1))]";
  if (count <= 4) return "bg-[hsl(var(--heatmap-2))]";
  if (count <= 6) return "bg-[hsl(var(--heatmap-3))]";
  return "bg-[hsl(var(--heatmap-4))]";
}

interface DayData {
  date: string;
  count: number;
  lessons: number;
  courses: number;
}

interface ActivityHeatmapProps {
  data: DayData[];
}

// ─── Popup (portal) to avoid overflow clipping ──────────────────────────────
interface PopupProps {
  anchorEl: HTMLElement;
  date: string;
  lessons: number;
  courses: number;
  onClose: () => void;
}

function DayPopup({ anchorEl, date, lessons, courses, onClose }: PopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // คำนวณตำแหน่งจาก anchor
  const rect = anchorEl.getBoundingClientRect();
  const POPUP_W = 148;
  const POPUP_H = 82;
  const MARGIN = 8;

  // วางเหนือ cell ก่อน ถ้าพอพื้นที่ ถ้าไม่พอให้ใต้
  const spaceAbove = rect.top - MARGIN;
  const spaceBelow = window.innerHeight - rect.bottom - MARGIN;
  const placeAbove = spaceAbove >= POPUP_H;

  let top = placeAbove
    ? rect.top - POPUP_H - 4
    : rect.bottom + 4;

  // จัดกลาง horizontal แต่กัน viewport edge
  let left = rect.left + rect.width / 2 - POPUP_W / 2;
  left = Math.max(MARGIN, Math.min(left, window.innerWidth - POPUP_W - MARGIN));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        e.target !== anchorEl
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [anchorEl, onClose]);

  return createPortal(
    <div
      ref={popupRef}
      style={{ top, left, width: POPUP_W, position: "fixed", zIndex: 9999 }}
      className="bg-popover text-popover-foreground border border-border rounded-lg shadow-xl p-2.5
        flex flex-col gap-1 animate-in fade-in-0 zoom-in-95"
    >
      <p className="font-semibold text-[10px] border-b pb-1 mb-1 border-border uppercase tracking-wider text-muted-foreground whitespace-nowrap">
        {formattedDate}
      </p>
      <div className="flex justify-between gap-4 text-xs">
        <span className="text-muted-foreground">Courses:</span>
        <span className="font-bold text-primary">{courses}</span>
      </div>
      <div className="flex justify-between gap-4 text-xs">
        <span className="text-muted-foreground">Lessons:</span>
        <span className="font-bold text-primary">{lessons}</span>
      </div>
    </div>,
    document.body
  );
}

// ─── DayCell ─────────────────────────────────────────────────────────────────
function DayCell({ day }: { day: { date: string; level: number; lessons: number; courses: number } }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl((prev) => (prev ? null : e.currentTarget));
  }, []);

  return (
    <>
      <div
        onClick={handleClick}
        className={`w-[10px] h-[10px] rounded-sm cursor-pointer transition-all hover:opacity-80 hover:scale-125 ${getLevel(day.level)}`}
      />
      {anchorEl && (
        <DayPopup
          anchorEl={anchorEl}
          date={day.date}
          lessons={day.lessons}
          courses={day.courses}
          onClose={() => setAnchorEl(null)}
        />
      )}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  // ปีจาก data เท่านั้น (ไม่แต่งเพิ่ม) + fallback ปีปัจจุบันถ้าไม่มีข้อมูล
  const years = useMemo(() => {
    if (!data.length) return [new Date().getFullYear()];
    return Array.from(
      new Set(data.map((d) => new Date(d.date).getFullYear()))
    ).sort((a, b) => b - a);
  }, [data]);

  const [selectedYear, setSelectedYear] = useState(years[0]);

  useEffect(() => {
    setSelectedYear(years[0]);
  }, [years]);

  const dataMap = useMemo(() => {
    const map: Record<string, DayData> = {};
    data.forEach((d) => { map[d.date] = d; });
    return map;
  }, [data]);

  const yearStats = useMemo(() => {
    const filtered = data.filter((d) => new Date(d.date).getFullYear() === selectedYear);
    return {
      lessons: filtered.reduce((s, d) => s + (d.lessons ?? d.count ?? 0), 0),
      courses: filtered.reduce((s, d) => s + (d.courses ?? 0), 0),
    };
  }, [data, selectedYear]);

  // สร้าง grid พร้อม month positions (colIndex = index ของ week column)
  const { weeks, monthPositions } = useMemo(() => {
    const result: { date: string; level: number; lessons: number; courses: number }[][] = [];
    const monthPos: { month: number; colIndex: number }[] = [];

    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear, 11, 31);
    const dayOfWeek = start.getDay() === 0 ? 6 : start.getDay() - 1;

    let currentWeek: { date: string; level: number; lessons: number; courses: number }[] = [];
    let prevMonth = -1;

    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({ date: "", level: -1, lessons: 0, courses: 0 });
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd_str = String(d.getDate()).padStart(2, "0");
      const key = `${yyyy}-${mm}-${dd_str}`;
      const month = d.getMonth();
      const dd = dataMap[key] || { date: key, lessons: 0, courses: 0, count: 0 };

      if (month !== prevMonth) {
        monthPos.push({ month, colIndex: result.length });
        prevMonth = month;
      }

      currentWeek.push({
        date: key,
        level: dd.count ?? 0,
        lessons: dd.lessons ?? 0,
        courses: dd.courses ?? 0,
      });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: "", level: -1, lessons: 0, courses: 0 });
      }
      result.push(currentWeek);
    }

    return { weeks: result, monthPositions: monthPos };
  }, [selectedYear, dataMap]);

  // offset ซ้ายของ day-label column = 24px (w-6) + 4px gap
  const DAY_COL_W = 28;


  return (
    <div className="rounded-xl border bg-card p-6 flex-1 min-w-0">
      <h3 className="text-lg font-bold text-card-foreground">Activity Track</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {yearStats.courses} Courses · {yearStats.lessons} Lessons in {selectedYear}
      </p>

      <div className="flex gap-4 items-start">
        {/* ─── Grid wrapper ─── */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          {/* Month row — labels ตรงกับ column จริง, ขนาด font = เดียวกับ dot */}
          <div
            className="relative mb-[2px]"
            style={{
              marginLeft: DAY_COL_W,
              height: FONT_SIZE,
              minWidth: weeks.length * CELL_STEP,
            }}
          >
            {monthPositions.map(({ month, colIndex }) => (
              <span
                key={month}
                className="absolute text-muted-foreground leading-none"
                style={{
                  left: colIndex * CELL_STEP,
                  fontSize: 11,
                  lineHeight: "11px",
                }}
              >
                {MONTHS[month]}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[2px]" style={{ minWidth: weeks.length * CELL_STEP + DAY_COL_W }}>
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] flex-shrink-0" style={{ width: DAY_COL_W - CELL_GAP }}>
              {DAYS.map((d, i) => (
                <div
                  key={i}
                  className="text-muted-foreground flex items-center"
                  style={{
                    height: FONT_SIZE,
                    fontSize: FONT_SIZE,
                    lineHeight: `${FONT_SIZE}px`,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px] flex-shrink-0">
                {week.map((day, di) => {
                  if (day.level === -1) {
                    return <div key={di} className="w-[10px] h-[10px] bg-transparent" />;
                  }
                  return <DayCell key={di} day={day} />;
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <span>Less</span>
            {[0, 1, 3, 5, 8].map((level) => (
              <div key={level} className={`w-[10px] h-[10px] rounded-sm ${getLevel(level)}`} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* ─── Year selector ─── */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                y === selectedYear
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;