import { today } from '@/lib/mockData';
import { trainingNumber } from '@/lib/training';
import Link from 'next/link';

export default function TrainingRow({ training }) {
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
}