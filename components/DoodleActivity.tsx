import React, { useState, useEffect, useRef } from 'react';

interface DoodleActivityProps {
  onBack: () => void;
  onComplete: () => void;
}

const COLORS = ['#333', '#fff', '#ef4444', '#3b82f6', '#22c55e', '#f97316', '#a855f7'];
const SIZES = [3, 8, 16];

export const DoodleActivity: React.FC<DoodleActivityProps> = ({ onBack, onComplete }) => {
    const [hasDrawn, setHasDrawn] = useState(false);
    const [color, setColor] = useState(COLORS[0]);
    const [lineWidth, setLineWidth] = useState(SIZES[1]);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawing = useRef(false);
    const history = useRef<ImageData[]>([]);
    
    const colorRef = useRef(color);
    const lineWidthRef = useRef(lineWidth);
    useEffect(() => { colorRef.current = color; }, [color]);
    useEffect(() => { lineWidthRef.current = lineWidth; }, [lineWidth]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        
        const setCanvasSize = () => {
            const { width, height } = container.getBoundingClientRect();
            const currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = width;
            canvas.height = height;
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
            ctx.lineTo(x, y);
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
    }, [hasDrawn]);
    
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

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        saveState();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if(!tempCtx) return;

        tempCtx.fillStyle = '#f9fafb';
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
        <button onClick={onClick} disabled={disabled} className={`w-14 h-14 flex items-center justify-center bg-white rounded-lg shadow-sm border hover:bg-gray-100 transition disabled:bg-gray-200 disabled:text-gray-400 ${className}`} aria-label={label}>
          {children}
        </button>
        <span className="text-xs mt-1 text-gray-600 font-semibold">{label}</span>
      </div>
    );

    return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col p-4 animate-slide-in-from-bottom" role="dialog" aria-modal="true">
        <header className="flex justify-between items-start mb-4 flex-shrink-0">
            <div>
            <h2 className="text-3xl font-bold text-gray-800">Doodle Pad</h2>
            <p className="text-gray-500 mt-1">Draw anything that makes you happy.</p>
            </div>
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors text-4xl leading-none -mt-1">&times;</button>
        </header>
        <main className="flex-grow overflow-hidden flex flex-col">
            <div ref={containerRef} className="flex-grow w-full relative rounded-xl overflow-hidden bg-gray-50 border shadow-inner">
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full cursor-crosshair"></canvas>
            </div>
            <div className="flex-shrink-0 pt-4 space-y-3">
                <div className="flex justify-center items-center gap-2 flex-wrap">
                    {COLORS.map(c => <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-7 h-7 rounded-full transition-transform transform hover:scale-110 border-2 ${color === c ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-200'} ${c === '#fff' ? 'shadow-inner' : ''}`}></button>)}
                </div>
                <div className="flex justify-center items-center gap-4">
                    {SIZES.map(s => <button key={s} onClick={() => setLineWidth(s)} className={`flex items-center justify-center rounded-full transition-colors ${lineWidth === s ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}`} style={{width: `${s*2+12}px`, height: `${s*2+12}px`}}><div className="rounded-full bg-gray-800" style={{width: `${s}px`, height: `${s}px`}}></div></button>)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <ActionButton onClick={undo} label="Undo">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                    </ActionButton>
                    <ActionButton onClick={clearCanvas} label="Clear">
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
        </main>
    </div>
    );
};