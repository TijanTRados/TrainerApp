import { trainings, unavailableDates, measurementDates } from '@/lib/mockData';
import Link from 'next/link';

export default function Home() {
  const year = 2026;
  const month = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const blanks = Array.from({ length: offset });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthLabel = new Date(year, month, 1)
    .toLocaleDateString('en-GB', { month: 'long' })
    .toLocaleUpperCase('en-GB');
  const monthStr = String(month + 1).padStart(2, '0');

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">{monthLabel} {year}</h1>

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

          const sorted = [...trainings].sort((a, b) => a.date.localeCompare(b.date));
          const numberById = {};
          sorted.forEach((t, i) => { numberById[t.id] = i + 1; });

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