// Shared learning data generator — single source of truth for stats + heatmap

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const CURRENT_DATE = new Date(2026, 2, 9); // March 9, 2026
const STREAK_DAYS = 3; // Current streak

export function generateYearData(year: number): Record<string, number> {
  const data: Record<string, number> = {};
  const start = new Date(year, 0, 1);
  const end = year === 2026 ? new Date(CURRENT_DATE) : new Date(year, 11, 31);
  const rand = seededRandom(year * 9973);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split("T")[0];
    const r = rand();

    if (year === 2026) {
      // Spread out, similar density to 2025
      if (r < 0.65) data[key] = 0;
      else if (r < 0.78) data[key] = 1;
      else if (r < 0.88) data[key] = 2;
      else if (r < 0.95) data[key] = 3;
      else data[key] = 4;
    } else if (year === 2025) {
      if (r < 0.70) data[key] = 0;
      else if (r < 0.82) data[key] = 1;
      else if (r < 0.92) data[key] = 2;
      else data[key] = 3;
    } else {
      if (r < 0.85) data[key] = 0;
      else if (r < 0.93) data[key] = 1;
      else data[key] = 2;
    }
  }

  // Force streak: last STREAK_DAYS days must have activity
  if (year === 2026) {
    for (let i = 0; i < STREAK_DAYS; i++) {
      const d = new Date(CURRENT_DATE);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (!data[key] || data[key] === 0) {
        data[key] = 1 + Math.floor(Math.random() * 3); // 1-3
      }
    }
    // Day before streak should be 0 to make streak exact
    const beforeStreak = new Date(CURRENT_DATE);
    beforeStreak.setDate(beforeStreak.getDate() - STREAK_DAYS);
    const beforeKey = beforeStreak.toISOString().split("T")[0];
    if (data[beforeKey] !== undefined) {
      data[beforeKey] = 0;
    }
  }

  return data;
}

export function getAllYears() {
  return [2026, 2025, 2024, 2023, 2022];
}

export function computeStats() {
  const years = getAllYears();
  const allData: Record<number, Record<string, number>> = {};
  let totalLessons = 0;
  const perYear: Record<number, number> = {};

  years.forEach((y) => {
    const d = generateYearData(y);
    allData[y] = d;
    const count = Object.values(d).filter((v) => v > 0).length;
    perYear[y] = count;
    totalLessons += count;
  });

  return {
    totalLessons,
    perYear,
    allData,
    coursesComplete: 2,
    totalHours: 23,
    streak: STREAK_DAYS,
  };
}
