import { trainings, trainingStatuses, unavailableDates, measurementDates, today } from '@/lib/mockData';
import { trainingNumber } from '@/lib/training';
import Link from 'next/link';

// Calendar cell component that displays the day number and a marker for training, unavailable, or measurement days
export default function CalendarCell({ day, dateStr }) {

    const training = trainings.find(t => t.date === dateStr);
    const isUnavailable = unavailableDates.some(d => d.date === dateStr);
    const isMeasurement = measurementDates.includes(dateStr);

    {/* Depending on the date's and training status, we choose a cerain style */ }
    let cellStyle = 'text-ink border-raised';
    let marker = '';

    if (training) {
        if (training.status === 1) { cellStyle = 'bg-sakura text-outline border-outline'; marker = trainingNumber(training); }
        else if (training.status === 2) { cellStyle = 'skipped-cell bg-sakura text-outline border-outline'; marker = ""; }
        else if (training.status === 0) { cellStyle = 'bg-sakura text-outline border-outline'; marker = trainingNumber(training); }
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
            <Link key={day} href={`/trainings/${training.id}`} className={`spotlight calendar-cell ${cellStyle}`} title={`${trainingStatuses[training.status]} ${training.type.toLocaleUpperCase()} at ${training.time} on ${training.date}`}>
                {content}
            </Link>
        );
    }

    return <div key={day} className={`calendar-cell ${cellStyle} spotlight`} >
        {content}
    </div>;
}