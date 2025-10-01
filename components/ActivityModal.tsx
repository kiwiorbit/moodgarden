import React, { useState, useEffect, useRef } from 'react';
import { Activity, ActivityType } from '../types';
import { getRandomJournalPrompt } from '../constants';

interface ActivityModalProps {
  activity: Activity;
  onClose: () => void;
  onComplete: (points: number) => void;
  addJournalEntry: (text: string) => void;
}

const GratitudeActivity: React.FC<{ onComplete: () => void; addJournalEntry: (text: string) => void; }> = ({ onComplete, addJournalEntry }) => {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const minLength = 25;

  useEffect(() => {
    setIsLoading(true);
    const fetchedPrompt = getRandomJournalPrompt();
    setPrompt(fetchedPrompt);
    setIsLoading(false);
  }, []);

  const handleComplete = () => {
    if (isComplete) {
      addJournalEntry(text);
      onComplete();
    }
  };

  const isComplete = text.trim().length >= minLength;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 min-h-[3rem] flex items-center justify-center">
        {isLoading ? (
          <p className="text-gray-500 italic animate-pulse">Finding some inspiration...</p>
        ) : (
          <p className="text-center text-gray-700 font-semibold animate-fade-in">"{prompt}"</p>
        )}
      </div>
      <textarea
        className="w-full flex-grow p-4 border border-amber-200 bg-amber-50 text-gray-800 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition placeholder-gray-500/70"
        placeholder="Let your thoughts flow..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Gratitude Journal Input"
        disabled={isLoading}
      />
      <div className="text-right text-sm text-gray-500 mt-1 pr-1 flex-shrink-0">
        {text.trim().length}/{minLength}
      </div>
      <button
        onClick={handleComplete}
        disabled={!isComplete}
        className="mt-4 w-full py-3 px-4 text-white font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:cursor-not-allowed flex-shrink-0"
        style={{ 
          backgroundColor: isComplete ? '#22c55e' : '#9ca3af',
          boxShadow: isComplete ? '0 4px 14px 0 rgba(34, 197, 94, 0.39)' : 'none',
        }}
      >
        {isComplete ? 'Complete' : 'Write a little more...'}
      </button>
    </div>
  );
};

const BreathingActivity: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [cycleText, setCycleText] = useState('Get Ready...');
    const [progress, setProgress] = useState(0);
    const [scale, setScale] = useState(1);
    const animationFrameId = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const totalDuration = 60 * 1000; // 60 seconds
    const inhaleTime = 4 * 1000;
    const holdTime = 2 * 1000;
    const exhaleTime = 6 * 1000;
    const cycleDuration = inhaleTime + holdTime + exhaleTime; // 12 seconds

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

    useEffect(() => {
        const startTimeout = setTimeout(() => { animationFrameId.current = requestAnimationFrame(animate); }, 1500);
        return () => {
            clearTimeout(startTimeout);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-8 select-none h-full">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute w-full h-full bg-sky-200/50 rounded-full transition-transform duration-200 ease-linear" style={{ transform: `scale(${scale})` }}></div>
                <div className="absolute w-full h-full rounded-full border-4 border-sky-400 transition-transform duration-200 ease-linear" style={{ transform: `scale(${scale * 0.7})` }}></div>
                <div className="w-52 h-52 bg-sky-300/80 rounded-full flex items-center justify-center transition-transform duration-200 ease-linear" style={{ transform: `scale(${scale})` }}></div>
                <p className="absolute text-3xl font-bold text-white drop-shadow-md">{cycleText}</p>
            </div>
            <div className="w-full max-w-sm bg-gray-200 rounded-full h-2.5">
                <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

const COLORS = ['#333', '#fff', '#ef4444', '#3b82f6', '#22c55e', '#f97316', '#a855f7'];
const SIZES = [3, 8, 16];

const DrawingActivity: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [hasDrawn, setHasDrawn] = useState(false);
    const [color, setColor] = useState(COLORS[0]);
    const [lineWidth, setLineWidth] = useState(SIZES[1]);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawing = useRef(false);
    const history = useRef<ImageData[]>([]);
    
    // Refs for drawing properties to avoid re-triggering the main effect
    const colorRef = useRef(color);
    const lineWidthRef = useRef(lineWidth);
    useEffect(() => { colorRef.current = color; }, [color]);
    useEffect(() => { lineWidthRef.current = lineWidth; }, [lineWidth]);

    // Main setup effect - runs only once
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        
        const setCanvasSize = () => {
            const { width, height } = container.getBoundingClientRect();
            // Save current drawing before resizing
            const currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = width;
            canvas.height = height;
            // Restore drawing after resizing
            ctx.putImageData(currentDrawing, 0, 0);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };
        
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const getCoords = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            saveState();
            isDrawing.current = true;
            const { x, y } = getCoords(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y); // Draw a dot on click
            ctx.strokeStyle = colorRef.current;
            ctx.lineWidth = lineWidthRef.current;
            ctx.stroke();
        };

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing.current) return;
            e.preventDefault();
            if (!hasDrawn) setHasDrawn(true);
            const { x, y } = getCoords(e);
            ctx.lineTo(x, y);
            ctx.strokeStyle = colorRef.current;
            ctx.lineWidth = lineWidthRef.current;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        const stopDrawing = () => { isDrawing.current = false; ctx.beginPath(); };
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [hasDrawn]); // Only hasDrawn dependency, so it doesn't reset on color/size change
    
    const saveState = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (history.current.length > 20) history.current.shift();
    };

    const undo = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || history.current.length === 0) return;
        ctx.putImageData(history.current.pop()!, 0, 0);
    };

    const clearCanvas = (save = true) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        if (save) saveState();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Create a temporary canvas with a white background
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if(!tempCtx) return;

        tempCtx.fillStyle = '#f9fafb'; // bg-gray-50
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        link.download = 'mood-garden-doodle.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    };

    const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; label: string; className?: string, disabled?: boolean }> = 
      ({ onClick, children, label, className = '', disabled=false }) => (
      <div className="flex flex-col items-center">
        <button 
          onClick={onClick} 
          disabled={disabled}
          className={`w-14 h-14 flex items-center justify-center bg-white rounded-lg shadow-sm border hover:bg-gray-100 transition disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 ${className}`}
          aria-label={label}
        >
          {children}
        </button>
        <span className="text-xs mt-1 text-gray-600 font-semibold">{label}</span>
      </div>
    );

    return (
        <div className="flex flex-col h-full w-full">
            <div ref={containerRef} className="flex-grow w-full relative rounded-xl overflow-hidden bg-gray-50 border shadow-inner">
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full cursor-crosshair"></canvas>
            </div>

            <div className="flex-shrink-0 pt-4 space-y-4">
                 {/* Colors */}
                <div className="flex justify-center items-center gap-2 flex-wrap">
                    {COLORS.map(c => (
                        <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 border-2 ${color === c ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-200'} ${c === '#fff' ? 'shadow-inner' : ''}`}></button>
                    ))}
                </div>
                {/* Sizes */}
                <div className="flex justify-center items-center gap-4">
                    {SIZES.map(s => (
                        <button key={s} onClick={() => setLineWidth(s)} className={`flex items-center justify-center rounded-full transition-colors ${lineWidth === s ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}`} style={{width: `${s*2+16}px`, height: `${s*2+16}px`}}>
                           <div className="rounded-full bg-gray-800" style={{width: `${s}px`, height: `${s}px`}}></div>
                        </button>
                    ))}
                </div>
                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <ActionButton onClick={undo} label="Undo">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                    </ActionButton>
                    <ActionButton onClick={() => clearCanvas(true)} label="Clear">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </ActionButton>
                     <ActionButton onClick={handleDownload} label="Download">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </ActionButton>
                    <ActionButton onClick={onComplete} label="Complete" disabled={!hasDrawn} className="!bg-green-500 !text-white hover:!bg-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </ActionButton>
                </div>
            </div>
        </div>
    );
};


const ActivityContent: React.FC<{ activity: Activity; onComplete: () => void; addJournalEntry: (text: string) => void; }> = ({ activity, onComplete, addJournalEntry }) => {
  switch (activity.type) {
    case ActivityType.Gratitude:
      return <GratitudeActivity onComplete={onComplete} addJournalEntry={addJournalEntry} />;
    case ActivityType.Breathing:
      return <BreathingActivity onComplete={onComplete} />;
    case ActivityType.Drawing:
        return <DrawingActivity onComplete={onComplete} />;
    default:
      return <p>Activity coming soon!</p>;
  }
};

export const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose, onComplete, addJournalEntry }) => {
  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col p-4 animate-slide-in-from-bottom" role="dialog" aria-modal="true">
      <header className="flex justify-between items-start mb-4 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{activity.name}</h2>
          <p className="text-gray-500 mt-1">{activity.description}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-4xl leading-none -mt-1" aria-label="Close modal">&times;</button>
      </header>
      <main className="flex-grow overflow-hidden">
        <ActivityContent activity={activity} onComplete={() => onComplete(activity.points)} addJournalEntry={addJournalEntry} />
      </main>
       <style>{`
          @keyframes slide-in-from-bottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-in-from-bottom { animation: slide-in-from-bottom 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
          @keyframes fade-in {
            from { opacity: 0; } to { opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
       `}</style>
    </div>
  );
};