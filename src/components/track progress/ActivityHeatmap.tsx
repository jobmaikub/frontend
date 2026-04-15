import { useState, useMemo, useEffect } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

function getLevel(count: number) {
  if (count === 0) return "bg-[hsl(var(--heatmap-0))]";
  if (count <= 2) return "bg-[hsl(var(--heatmap-1))]";
  if (count <= 4) return "bg-[hsl(var(--heatmap-2))]";
  if (count <= 6) return "bg-[hsl(var(--heatmap-3))]";
  return "bg-[hsl(var(--heatmap-4))]";
}

interface ActivityHeatmapProps {
  data: {
    date: string;
    count: number;
  }[];
}

const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  // ✅ กัน empty crash
  const years = useMemo(() => {
    if (!data.length) return [new Date().getFullYear()];
    return Array.from(
      new Set(data.map((d) => new Date(d.date).getFullYear()))
    ).sort((a, b) => b - a);
  }, [data]);

  const [selectedYear, setSelectedYear] = useState(years[0]);

  // ✅ reset ปีเมื่อ data เปลี่ยน
  useEffect(() => {
    setSelectedYear(years[0]);
  }, [years]);

  // 🔥 map data
  const dataMap = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((d) => {
      map[d.date] = (map[d.date] || 0) + d.count; // ✅ กัน duplicate วัน
    });
    return map;
  }, [data]);

  // 🔥 lessons ต่อปี
  const lessonsCount = useMemo(() => {
    return data
      .filter((d) => new Date(d.date).getFullYear() === selectedYear)
      .reduce((sum, d) => sum + d.count, 0);
  }, [data, selectedYear]);

  // 🔥 grid
  const weeks = useMemo(() => {
    const result: { date: string; level: number }[][] = [];

    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear, 11, 31);

    const dayOfWeek = start.getDay() === 0 ? 6 : start.getDay() - 1;

    let currentWeek: { date: string; level: number }[] = [];

    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({ date: "", level: -1 });
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      const count = dataMap[key] ?? 0;

      currentWeek.push({
        date: key,
        level: count,
      });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: "", level: -1 });
      }
      result.push(currentWeek);
    }

    return result;
  }, [selectedYear, dataMap]);

  // ✅ empty UI (ยัง render structure)
  if (!data.length) {
    return (
      <div className="rounded-xl border bg-card p-6 flex-1">
        <h3 className="text-lg font-bold">Activity Track</h3>
        <p className="text-sm text-muted-foreground mt-2">
          No activity yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 flex-1">
      <h3 className="text-lg font-bold text-card-foreground">
        Activity Track
      </h3>

      <p className="text-sm text-muted-foreground mb-4">
        {lessonsCount} Lessons in {selectedYear}
      </p>

      <div className="flex gap-6">
        <div className="flex-1 overflow-x-auto">
          <div className="flex mb-1 ml-8">
            {MONTHS.map((m) => (
              <div key={m} className="text-xs text-muted-foreground flex-1">
                {m}
              </div>
            ))}
          </div>

          <div className="flex gap-[2px]">
            <div className="flex flex-col gap-[2px] mr-1">
              {DAYS.map((d, i) => (
                <div
                  key={i}
                  className="text-xs text-muted-foreground h-[11px] leading-[11px] w-6"
                >
                  {d}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`w-[11px] h-[11px] rounded-sm ${
                      day.level === -1
                        ? "bg-transparent"
                        : getLevel(day.level)
                    }`}
                    title={
                      day.date
                        ? `${day.date}: ${day.level} lessons`
                        : ""
                    }
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <span>Less</span>
            {[0, 1, 3, 5, 8].map((level) => (
              <div
                key={level}
                className={`w-[11px] h-[11px] rounded-sm ${getLevel(level)}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Year selector */}
        <div className="flex flex-col gap-1">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
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