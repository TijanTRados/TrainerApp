export const currentPackage = { id: 2, size: 10 };

export const trainings = [
    { id: 1, packageId: 1, date: '2026-07-02', time: '18:00', type: 'upper' },
    { id: 2, packageId: 1, date: '2026-07-06', time: '18:00', type: 'lower' },
    { id: 3, packageId: 1, date: '2026-07-09', time: '19:00', type: 'upper' },
    { id: 4, packageId: 1, date: '2026-07-13', time: '18:00', type: 'lower' },
    { id: 5, packageId: 1, date: '2026-07-16', time: '18:00', type: 'upper' },
    { id: 6, packageId: 1, date: '2026-07-20', time: '19:00', type: 'lower' },
    { id: 7, packageId: 1, date: '2026-07-23', time: '18:00', type: 'upper' },
    { id: 8, packageId: 1, date: '2026-07-27', time: '18:00', type: 'lower' },
    { id: 9, packageId: 1, date: '2026-07-30', time: '19:00', type: 'upper' },
    { id: 10, packageId: 1, date: '2026-08-03', time: '18:00', type: 'lower' },
    { id: 11, packageId: 2, date: '2026-08-06', time: '18:00', type: 'upper' },
    { id: 12, packageId: 2, date: '2026-08-10', time: '18:00', type: 'lower' },
    { id: 13, packageId: 2, date: '2026-08-13', time: '19:00', type: 'upper' },
    { id: 14, packageId: 2, date: '2026-08-17', time: '18:00', type: 'lower' },
    { id: 15, packageId: 2, date: '2026-08-20', time: '18:00', type: 'upper' },
    { id: 16, packageId: 2, date: '2026-08-24', time: '19:00', type: 'lower' },
    { id: 17, packageId: 2, date: '2026-08-27', time: '18:00', type: 'upper' },
    { id: 18, packageId: 2, date: '2026-08-31', time: '18:00', type: 'lower' },
    { id: 19, packageId: 2, date: '2026-09-03', time: '18:00', type: 'upper' },
    { id: 20, packageId: 2, date: '2026-09-07', time: '18:00', type: 'lower' },
];

export const unavailableDates = [
    { date: '2026-07-10', who: 'trainer' },
    { date: '2026-07-17', who: 'trainee' },
    { date: '2026-08-07', who: 'trainer' },
    { date: '2026-08-21', who: 'trainee' },
];

export const measurementDates = ['2026-07-15', '2026-08-14'];

if (typeof window !== 'undefined') {
    window.mock = { currentPackage, trainings, unavailableDates, measurementDates };
}