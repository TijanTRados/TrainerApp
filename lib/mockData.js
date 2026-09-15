export const currentPackage = { id: 2, size: 10 };
export const today = '2026-08-20';
export const trainingStatuses = ['Upcoming', 'Done', 'Skipped'];
export const exerciseStatuses = ['Not Started', 'In Progress', 'Completed'];

export const trainings = [
    { id: 1, packageId: 1, date: '2026-07-02', time: '18:00', type: 'upper', status: 1 },
    { id: 2, packageId: 1, date: '2026-07-06', time: '18:00', type: 'lower', status: 1 },
    { id: 3, packageId: 1, date: '2026-07-09', time: '19:00', type: 'upper', status: 1 },
    { id: 4, packageId: 1, date: '2026-07-13', time: '18:00', type: 'lower', status: 1 },
    { id: 5, packageId: 1, date: '2026-07-16', time: '18:00', type: 'upper', status: 1 },
    { id: 6, packageId: 1, date: '2026-07-20', time: '19:00', type: 'lower', status: 1 },
    { id: 7, packageId: 1, date: '2026-07-23', time: '18:00', type: 'upper', status: 1 },
    { id: 8, packageId: 1, date: '2026-07-27', time: '18:00', type: 'lower', status: 1 },
    { id: 9, packageId: 1, date: '2026-07-30', time: '19:00', type: 'upper', status: 1 },
    { id: 10, packageId: 1, date: '2026-08-03', time: '18:00', type: 'lower', status: 2 },
    { id: 11, packageId: 2, date: '2026-08-06', time: '18:00', type: 'upper', status: 1 },
    { id: 12, packageId: 2, date: '2026-08-10', time: '18:00', type: 'lower', status: 1 },
    { id: 13, packageId: 2, date: '2026-08-13', time: '19:00', type: 'upper', status: 1 },
    { id: 14, packageId: 2, date: '2026-08-17', time: '18:00', type: 'lower', status: 2 },
    {
        id: 15, packageId: 2, date: '2026-08-20', time: '18:00', type: 'upper', status: 0,
        categories: [
            {
                name: 'Warm-up', exercises: [
                    { id: 1, name: 'AirBike', sets: 1, duration: 300, weight: null, status: 0 },
                    { id: 2, name: 'Back ups with weights laying on belly', sets: 1, reps: 10, weight: 2, status: 0 }
                ]
            },
            {
                name: 'Series 1', exercises: [
                    { id: 3, name: 'Bench press', sets: 3, reps: 10, weight: 45, status: 0 },
                    { id: 4, name: 'Triceps pull', sets: 3, reps: 12, weight: 45, status: 0 }
                ]
            },
            {
                name: 'Series 2', exercises: [
                    { id: 5, name: 'Shoulder press', sets: 3, reps: 10, weight: 17.5, status: 0 },
                    { id: 6, name: 'Bicep curls', sets: 3, reps: 12, weight: 15, status: 0 }
                ]
            }
        ]
    },
    { id: 16, packageId: 2, date: '2026-08-24', time: '19:00', type: 'lower', status: 0 },
    { id: 17, packageId: 2, date: '2026-08-27', time: '18:00', type: 'upper', status: 0 },
    { id: 18, packageId: 2, date: '2026-08-31', time: '18:00', type: 'lower', status: 0 },
    { id: 19, packageId: 2, date: '2026-09-03', time: '18:00', type: 'upper', status: 0 },
    { id: 20, packageId: 2, date: '2026-09-07', time: '18:00', type: 'lower', status: 0 },
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