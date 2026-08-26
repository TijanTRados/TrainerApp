'use client';
import { useState } from 'react';

import { trainings, unavailableDates, measurementDates } from '@/lib/mockData';
import Link from 'next/link';

const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// Returns the 1-based index of the training within its package, sorted by date
function trainingNumber(training) {
  return trainings
    .filter(t => t.packageId === training.packageId)
    .sort((a, b) => a.date.localeCompare(b.date))
    .indexOf(training) + 1;
}

export default function Home() {
  // Stays null through the server render and the first client render, so both
  // produce identical HTML. The server can't know the visitor's local date.
  const [cursor, setCursor] = useState({ year: 2026, month: 6 });

  // Shift the cursor by a number of months, positive or negative
  function shiftMonth(delta) {
    setCursor(({ year, month }) => {
      // Day 1 of month ±delta — the Date constructor rolls the year over for us.
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  // Handling the days of the month and the offset for the first day of the month
  const { year, month } = cursor;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const blanks = Array.from({ length: offset });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthLabel = new Date(year, month, 1)
    .toLocaleDateString('en-GB', { month: 'long' })
    .toLocaleUpperCase('en-GB');
  const monthStr = String(month + 1).padStart(2, '0');

  // Styling for the navigation buttons
  const navButtonClass =
    'w-8 h-8 border-2 border-raised bg-surface text-ink flex items-center justify-center text-lg leading-none';

  return (
    <main className="p-4 max-w-md mx-auto">
      {/* Header and navigation buttons */}
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

      {/* Calendar grid */}
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

          let cellStyle = 'text-ink border-raised';
          let marker = '';
          if (training) { cellStyle = 'bg-sakura text-outline border-outline'; marker = trainingNumber(training); }
          else if (isUnavailable) { cellStyle = 'bg-raised text-muted border-raised'; marker = 'x'; }
          else if (isMeasurement) { cellStyle = 'bg-yuzu text-outline border-outline font-bold'; marker = '!'; }

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