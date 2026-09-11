import { trainings } from './mockData';

// Returns the 1-based index of the training within its package, sorted by date
export function trainingNumber(training) {
    return trainings
        .filter(t => t.packageId === training.packageId && t.status !== 'Skipped')
        .sort((a, b) => a.date.localeCompare(b.date))
        .indexOf(training) + 1;
}