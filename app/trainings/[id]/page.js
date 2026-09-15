'use client';
import { useState } from 'react';
import { trainings, trainingStatuses, currentPackage, today } from '@/lib/mockData';
import { trainingNumber } from '@/lib/training';

export default async function TrainingPage({ params }) {
    const { id } = await params;
    const training = trainings.find(t => t.id === parseInt(id));
    if (!training) {
        return <main><h1>Training not found</h1></main>;
    }
    const number = trainingNumber(training);
    const { packageId, date, time, type, status } = training;
    return (
        <main className="p-4 max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-sakura">{type.toUpperCase()} BODY: {number}</h1>
            <p className="text-lg">Date: {date}</p>
            <p className="text-lg">Time: {time}</p>
            <p className="text-lg">Type: {type}</p>
            <p className="text-lg">Status: {trainingStatuses[status]}</p>
        </main>
    )
}