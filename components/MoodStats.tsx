import React from 'react';
import { MoodEntry, Mood } from '../types';
import { MOODS } from '../constants';

interface MoodStatsProps {
  moodHistory: MoodEntry[];
  onBack: () => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Add timezone offset to prevent date from shifting
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });
};

export const MoodStats: React.FC<MoodStatsProps> = ({ moodHistory, onBack }) => {
    
    const moodCounts = React.useMemo(() => {
        const counts = new Map<Mood, number>();
        MOODS.forEach(m => counts.set(m.type, 0));
        moodHistory.forEach(entry => {
            counts.set(entry.mood, (counts.get(entry.mood) || 0) + 1);
        });
        return counts;
    }, [moodHistory]);

    const totalDays = moodHistory.length;
    const maxCount = Math.max(1, ...Array.from(moodCounts.values()));
    
    const mostFrequentMood = React.useMemo(() => {
        if (totalDays === 0) return null;
        let max = -1;
        let mood: Mood | null = null;
        for (const [m, count] of moodCounts.entries()) {
            if (count > max) {
                max = count;
                mood = m;
            }
        }
        return MOODS.find(m => m.type === mood);
    }, [moodCounts, totalDays]);
    
    const recentHistory = [...moodHistory].reverse().slice(0, 7);

    const StatCard: React.FC<{ label: string; value: string | React.ReactNode; icon: string }> = ({ label, value, icon }) => (
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 flex items-center space-x-4">
            <div className="text-4xl">{icon}</div>
            <div>
                <p className="text-sm font-semibold text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col p-4 animate-slide-in-from-bottom" role="dialog" aria-modal="true">
            <header className="flex justify-between items-center mb-6 flex-shrink-0">
                <h2 className="text-3xl font-bold text-gray-800">My Mood Journey</h2>
                <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors text-4xl leading-none" aria-label="Close stats">&times;</button>
            </header>
            
            <main className="flex-grow overflow-y-auto overflow-x-hidden space-y-6 pb-4">
                {totalDays === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <span className="text-5xl mb-4">📊</span>
                        <h3 className="text-xl font-semibold">No data yet.</h3>
                        <p className="max-w-xs">Start logging your mood each day to see your progress here!</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <h3 className="text-xl font-bold text-gray-700 mb-3">Summary</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard label="Days Logged" value={totalDays} icon="🗓️" />
                                <StatCard 
                                    label="Most Frequent" 
                                    value={<div className="flex items-center gap-2">{mostFrequentMood?.icon} <span className="text-xl">{mostFrequentMood?.type}</span></div>}
                                    icon="🏆" 
                                />
                            </div>
                        </section>

                        {/* Mood Distribution */}
                        <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-xl font-bold text-gray-700 mb-3">Mood Distribution</h3>
                            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 space-y-3">
                                {MOODS.map(({ type, icon }) => {
                                    const count = moodCounts.get(type) || 0;
                                    const percentage = totalDays > 0 ? (count / maxCount) * 100 : 0;
                                    return (
                                        <div key={type} className="flex items-center gap-3">
                                            <span className="text-2xl w-8 text-center">{icon}</span>
                                            <div className="flex-grow bg-gray-200 rounded-full h-6 overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-teal-400 to-cyan-500 h-full rounded-full flex items-center justify-end px-2 transition-all duration-500 ease-out" 
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 w-8 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                        
                        {/* Recent History */}
                        <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <h3 className="text-xl font-bold text-gray-700 mb-3">Recent History (Last 7 Days)</h3>
                            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50">
                                {recentHistory.length > 0 ? (
                                    <ul className="space-y-2">
                                        {recentHistory.map((entry) => (
                                             <li key={entry.date} className="flex justify-between items-center bg-white/50 p-2 rounded-md">
                                                <span className="font-semibold text-gray-600">{formatDate(entry.date)}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">{MOODS.find(m => m.type === entry.mood)?.icon}</span>
                                                    <span className="font-bold text-gray-800">{entry.mood}</span>
                                                </div>
                                             </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Not enough history to show.</p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};