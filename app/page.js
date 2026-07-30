'use client';
import { useState, useEffect } from 'react';

import { trainings, unavailableDates, measurementDates } from '@/lib/mockData';
import Link from 'next/link';

const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Training numbers run across the whole dataset, not per month, so this is
// stable for the lifetime of the module.
const numberById = {};
[...trainings]
  .sort((a, b) => a.date.localeCompare(b.date))
  .forEach((t, i) => { numberById[t.id] = i + 1; });

export default function Home() {
  // Stays null through the server render and the first client render, so both
  // produce identical HTML. The server can't know the visitor's local date.
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    const now = new Date();
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
  }, []);

  function shiftMonth(delta) {
    setCursor(({ year, month }) => {
      // Day 1 of month ±delta — the Date constructor rolls the year over for us.
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  if (!cursor) return <CalendarSkeleton />;

  const { year, month } = cursor;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const blanks = Array.from({ length: offset });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthLabel = new Date(year, month, 1)
    .toLocaleDateString('en-GB', { month: 'long' })
    .toLocaleUpperCase('en-GB');
  const monthStr = String(month + 1).padStart(2, '0');

  return (
    <main className="p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className={navButtonClass}
        >
          ‹
        </button>
        <h1 className="text-xl font-bold">{monthLabel} {year}</h1>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className={navButtonClass}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((name, i) => (
          <div key={i} className="text-sm text-muted ">{name}</div>
        ))}

        {blanks.map((_, i) => (
          <div key={i}></div>
        ))}

        {days.map((day) => {
          const dateStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
          const training = trainings.find(t => t.date === dateStr);
          const isUnavailable = unavailableDates.some(d => d.date === dateStr);
          const isMeasurement = measurementDates.includes(dateStr);

          let cellStyle = 'bg-surface text-ink border-raised';
          let marker = '';
          if (training) { cellStyle = 'bg-sakura text-outline border-outline'; marker = numberById[training.id]; }
          else if (isUnavailable) { cellStyle = 'bg-raised text-muted border-raised'; marker = 'X'; }
          else if (isMeasurement) { cellStyle = 'bg-yuzu text-outline border-outline'; marker = '!'; }

          const cellClass = `relative aspect-square border-2 flex items-center justify-center text-sm ${cellStyle}`;

          const content = (
            <>
              <span className="absolute top-0.5 left-1 text-[10px] opacity-60">{day}</span>
              <span className="text-base">{marker}</span>
            </>
          );

          if (training) {
            return (
              <Link key={day} href={`/trainings/${training.id}`} className={cellClass}>
                {content}
              </Link>
            );
          }

          return <div key={day} className={cellClass}>{content}</div>;
        })}
      </div>
    </main>
  );
}

const navButtonClass =
  'w-8 h-8 border-2 border-raised bg-surface text-ink flex items-center justify-center text-lg leading-none';

function CalendarSkeleton() {
  return (
    <main className="p-4 max-w-md mx-auto" aria-busy="true">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8" />
        <div className="h-7 w-40 bg-raised" />
        <div className="w-8 h-8" />
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((name, i) => (
          <div key={i} className="text-sm text-muted ">{name}</div>
        ))}

        {Array.from({ length: 42 }, (_, i) => (
          <div key={i} className="aspect-square border-2 border-raised bg-surface" />
        ))}
      </div>
    </main>
  );
}
