'use client';
import { useState } from 'react';

import { trainings, unavailableDates, measurementDates, currentPackage, today } from '@/lib/mockData';
import Link from 'next/link';

const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// Returns the 1-based index of the training within its package, sorted by date
function trainingNumber(training) {
  return trainings
    .filter(t => t.packageId === training.packageId && t.status !== 'Skipped')
    .sort((a, b) => a.date.localeCompare(b.date))
    .indexOf(training) + 1;
}

// Spotlight effect for the calendar cells
function handleSpotlight(e) {
  e.currentTarget.querySelectorAll('.spotlight').forEach((cell) => {
    const r = cell.getBoundingClientRect();
    cell.style.setProperty('--mx', `${e.clientX - r.left}px`);
    cell.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

export default function Home() {
  // Stays null through the server render and the first client render, so both
  // produce identical HTML. The server can't know the visitor's local date.
  const [cursor, setCursor] = useState({ year: 2026, month: 7 });

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
  const trainingsDone = trainings.filter(
    t => t.packageId === currentPackage.id && t.status === 'Done'
  ).length;
  const packagePercent = Math.round((trainingsDone / currentPackage.size) * 100);
  const [showPast, setShowPast] = useState(false);

  // Styling for the navigation buttons
  const navButtonClass =
    'w-8 h-8 border-2 border-raised bg-surface text-ink flex items-center justify-center text-lg leading-none';

  return (
    <main className="p-4 max-w-md mx-auto spotlight-area" onMouseMove={handleSpotlight}>

      {/* ...........................................
                Package number and progress 
          ...........................................
      */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted tracking-wide whitespace-nowrap">
          PACKAGE {currentPackage.id} · {trainingsDone} / {currentPackage.size}
        </span>

        <div className="flex-1 h-2 bg-raised border-2 border-outline">
          <div
            className="h-full bg-sakura"
            style={{ width: `${packagePercent}%` }}
          />
        </div>
      </div>

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

      {/* ...........................................
                        Calendar grid 
          ...........................................
      */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((name, i) => (
          <div key={i} className="text-sm text-muted ">{name}</div>
        ))}

        {/* Skip blank cells for the first week */}
        {blanks.map((_, i) => (
          <div key={i}></div>
        ))}

        {/* Days iteration */}
        {days.map((day) => {
          const dateStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
          const training = trainings.find(t => t.date === dateStr);
          const isUnavailable = unavailableDates.some(d => d.date === dateStr);
          const isMeasurement = measurementDates.includes(dateStr);

          {/* Depending on the date's and training status, we choose a cerain style */ }
          let cellStyle = 'text-ink border-raised';
          let marker = '';

          if (training) {
            if (training.status === 'Done') { cellStyle = 'bg-sakura text-outline border-outline'; marker = trainingNumber(training); }
            else if (training.status === 'Skipped') { cellStyle = 'skipped-cell bg-sakura text-outline border-outline'; marker = ""; }
            else if (training.status === 'Upcoming') { cellStyle = 'bg-sakura text-outline border-outline'; marker = trainingNumber(training); }
          }
          else if (isUnavailable) { cellStyle = 'bg-raised text-muted border-raised'; marker = 'x'; }
          else if (isMeasurement) { cellStyle = 'bg-yuzu text-outline border-outline font-bold'; marker = '!'; }
          if (dateStr === today) { cellStyle += ' outline-2 outline-momiji'; }
          else if (dateStr < today) { cellStyle += ' opacity-60'; }

          {/* Cell content */ }
          const content = (
            <>
              <span className="absolute top-0.5 left-1 text-[10px] opacity-70">{day}</span>
              <span className="text-base">{marker}</span>
            </>
          );

          if (training) {
            return (
              <Link key={day} href={`/trainings/${training.id}`} className={`spotlight calendar-cell ${cellStyle}`}>
                {content}
              </Link>
            );
          }

          return <div key={day} className={`calendar-cell ${cellStyle} spotlight`}>
            {content}
          </div>;
        })}
      </div>

      {/* ...........................................
                        Training list
          ...........................................
      */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold mb-2">TRAINING LIST</h2>
          <label className="toggle">
            Show past
            <input
              type="checkbox"
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
            />
            <span className="toggle-track"><span className="toggle-knob" /></span>
          </label>
        </div>
        <ul className="space-y-1">
          {
            trainings
              .filter(t => t.date.startsWith(`${year}-${monthStr}`))
              .filter(t => showPast || t.date >= today)
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((training) => {
                {/* Depending on the date's status, we choose a cerain style */ }
                let cellStyle = "";
                let marker = "";
                if (training.status === 'Done') { cellStyle = 'bg-surface border-outline'; marker = trainingNumber(training); }
                else if (training.status === 'Skipped') { cellStyle = 'skipped-list'; marker = "-"; }
                else if (training.status === 'Upcoming') { cellStyle = 'bg-surface border-outline'; marker = trainingNumber(training); }

                if (training.date === today) { cellStyle += ' outline-2 outline-momiji'; }
                else if (training.date < today) { cellStyle += ' opacity-60'; }

                return (
                  <li key={training.id} className={`training-list spotlight ${cellStyle}`} title={`${training.status} ${training.type.toLocaleUpperCase()} at ${training.time} on ${training.date}`}>
                    <Link href={`/trainings/${training.id}`} className="flex items-center gap-5 p-1">
                      <div className="training-list-date">{training.date}</div>
                      <div className="training-list-number">{marker}</div>
                      <div className="training-list-content">{training.type.toLocaleUpperCase()} at {training.time}</div>
                      <div className="training-list-status">{training.status}</div>
                    </Link>
                  </li>
                );
              })}
        </ul>
      </div>
    </main >
  );
}