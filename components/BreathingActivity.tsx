import React, { useState, useEffect, useRef } from 'react';

interface BreathingActivityProps {
  onBack: () => void;
  onComplete: () => void;
}

export const BreathingActivity: React.FC<BreathingActivityProps> = ({ onBack, onComplete }) => {
    const [cycleText, setCycleText] = useState('Get Ready...');
    const [progress, setProgress] = useState(0);
    const [scale, setScale] = useState(1);
    const animationFrameId = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const totalDuration = 60 * 1000; // 60 seconds
    const inhaleTime = 4 * 1000;
    const holdTime = 2 * 1000;
    const exhaleTime = 6 * 1000;
    const cycleDuration = inhaleTime + holdTime + exhaleTime;

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsedTime = timestamp - startTimeRef.current;
            
            if (elapsedTime >= totalDuration) {
                setProgress(100); setCycleText('Done!'); setScale(1);
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                setTimeout(onComplete, 1200);
                return;
            }

            setProgress((elapsedTime / totalDuration) * 100);
            const cycleElapsedTime = elapsedTime % cycleDuration;

            if (cycleElapsedTime < inhaleTime) {
                setCycleText('Breathe In...');
                setScale(1 + (cycleElapsedTime / inhaleTime) * 0.5);
            } else if (cycleElapsedTime < inhaleTime + holdTime) {
                setCycleText('Hold'); setScale(1.5);
            } else {
                setCycleText('Breathe Out...');
                setScale(1.5 - ((cycleElapsedTime - inhaleTime - holdTime) / exhaleTime) * 0.5);
            }
            animationFrameId.current = requestAnimationFrame(animate);
        };
        const startTimeout = setTimeout(() => { animationFrameId.current = requestAnimationFrame(animate); }, 1500);
        return () => {
            clearTimeout(startTimeout);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col p-4 animate-slide-in-from-bottom" role="dialog" aria-modal="true">
            <header className="flex justify-between items-start mb-4 flex-shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Mindful Breathing</h2>
                    <p className="text-gray-500 mt-1">Follow the guide for one minute.</p>
                </div>
                <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors text-4xl leading-none -mt-1">&times;</button>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center space-y-8 select-none">
                <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className="absolute w-full h-full bg-sky-200/50 rounded-full transition-transform duration-200 ease-linear" style={{ transform: `scale(${scale})` }}></div>
                    <div className="w-52 h-52 bg-sky-300/80 rounded-full flex items-center justify-center transition-transform duration-200 ease-linear" style={{ transform: `scale(${scale})` }}></div>
                    <p className="absolute text-3xl font-bold text-white drop-shadow-md">{cycleText}</p>
                </div>
                <div className="w-full max-w-sm bg-gray-200 rounded-full h-2.5">
                    <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </main>
        </div>
    );
};
