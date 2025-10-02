import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ZenGardenProps {
  onBack: () => void;
  onComplete: () => void;
}

type RakeType = 'fine' | 'wide';
type Tool = 'rake' | 'stone';
interface Stone {
  id: number;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  color: string;
  isGem?: boolean;
}

const ToolButton: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 rounded-lg w-20 h-20 transition-all duration-200 ${isActive ? 'bg-teal-500 text-white shadow-lg' : 'bg-white/70 hover:bg-white'}`} aria-label={`Select ${label} tool`}>
        <span className="text-3xl">{icon}</span>
        <span className="text-xs font-semibold mt-1">{label}</span>
    </button>
);

const STONE_COLOR_PALETTES = [
    { h: [190, 40], s: [15, 10], l: [55, 10] }, // Greyish blue
    { h: [30, 20], s: [20, 15], l: [60, 10] }, // Sandy brown
    { h: [210, 30], s: [10, 10], l: [40, 10] }, // Dark slate
    { h: [90, 40], s: [5, 10], l: [50, 10] },   // Mossy green-grey
];


export const ZenGarden: React.FC<ZenGardenProps> = ({ onBack, onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const isDrawing = useRef(false);

    const [activeTool, setActiveTool] = useState<Tool>('rake');
    const [rakeType, setRakeType] = useState<RakeType>('fine');
    const [stones, setStones] = useState<Stone[]>([]);
    const [isMuted, setIsMuted] = useState(false);

    const drawSand = useCallback((ctx: CanvasRenderingContext2D) => {
        const canvas = ctx.canvas;
        ctx.fillStyle = '#f0e5d1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 15000; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }, []);

    const drawStones = useCallback((ctx: CanvasRenderingContext2D) => {
        stones.forEach(stone => {
            ctx.save();
            ctx.translate(stone.x, stone.y);
            ctx.rotate(stone.rotation);
            
            // Shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 8;

            // Stone
            ctx.fillStyle = stone.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, stone.radiusX, stone.radiusY, 0, 0, 2 * Math.PI);
            ctx.fill();
            
            if (stone.isGem) {
                // Add a highlight to the gem
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.beginPath();
                ctx.ellipse(-stone.radiusX * 0.2, -stone.radiusY * 0.3, stone.radiusX * 0.2, stone.radiusY * 0.15, Math.PI / 4, 0, 2 * Math.PI);
                ctx.fill();
            }

            ctx.restore();
        });
    }, [stones]);
    
    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSand(ctx);
        // In a more advanced version, we would redraw saved rake lines here.
        drawStones(ctx);
    }, [drawSand, drawStones]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setCanvasSize = () => {
            const { width, height } = container.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            redrawCanvas();
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        
        const getCoords = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const handlePointerDown = (e: MouseEvent | TouchEvent) => {
            const { x, y } = getCoords(e);
            if (activeTool === 'stone') {
                const isGem = Math.random() < 0.15; // 15% chance for a gem
                let color: string;
                if (isGem) {
                    color = `hsl(0, 80%, 60%)`;
                } else {
                    const chosenPalette = STONE_COLOR_PALETTES[Math.floor(Math.random() * STONE_COLOR_PALETTES.length)];
                    const hue = chosenPalette.h[0] + Math.random() * chosenPalette.h[1];
                    const saturation = chosenPalette.s[0] + Math.random() * chosenPalette.s[1];
                    const lightness = chosenPalette.l[0] + Math.random() * chosenPalette.l[1];
                    color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                }
                const newStone: Stone = {
                    id: Date.now(),
                    x, y,
                    radiusX: 10 + Math.random() * 12.5,
                    radiusY: 10 + Math.random() * 7.5,
                    rotation: Math.random() * Math.PI * 2,
                    color: color,
                    isGem: isGem,
                };
                setStones(prev => [...prev, newStone]);
            } else if (activeTool === 'rake') {
                isDrawing.current = true;
                ctx.beginPath();
                ctx.moveTo(x, y);
            }
        };

        const handlePointerMove = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing.current || activeTool !== 'rake') return;
            e.preventDefault();
            const { x, y } = getCoords(e);

            const width = rakeType === 'fine' ? 2 : 12;
            const grooveCount = rakeType === 'fine' ? 1 : 5;

            for (let i = 0; i < grooveCount; i++) {
                const offset = (i - Math.floor(grooveCount / 2)) * (width / (grooveCount-1) * 1.5);

                // Shadow
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.lineTo(x + offset + 0.5, y + 0.5);
                ctx.stroke();

                // Highlight
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 1;
                ctx.lineTo(x + offset - 0.5, y - 0.5);
                ctx.stroke();

                ctx.moveTo(x + offset, y);
            }
        };

        const handlePointerUp = () => { isDrawing.current = false; ctx.beginPath(); };
        
        canvas.addEventListener('mousedown', handlePointerDown);
        canvas.addEventListener('mousemove', handlePointerMove);
        canvas.addEventListener('mouseup', handlePointerUp);
        canvas.addEventListener('mouseleave', handlePointerUp);
        canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
        canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
        canvas.addEventListener('touchend', handlePointerUp);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            canvas.removeEventListener('mousedown', handlePointerDown);
            canvas.removeEventListener('mousemove', handlePointerMove);
            canvas.removeEventListener('mouseup', handlePointerUp);
            canvas.removeEventListener('mouseleave', handlePointerUp);
            canvas.removeEventListener('touchstart', handlePointerDown);
            canvas.removeEventListener('touchmove', handlePointerMove);
            canvas.removeEventListener('touchend', handlePointerUp);
        };
    }, [activeTool, rakeType, redrawCanvas]);

    useEffect(redrawCanvas, [stones, redrawCanvas]);

    const smoothSand = () => {
        setStones([]);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        let progress = 0;
        const duration = 500;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            const wipeWidth = canvas.width * progress;
            ctx.clearRect(0, 0, wipeWidth, canvas.height);
            drawSand(ctx);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (!isMuted) {
            audio.play().catch(e => console.log("Audio play failed, user interaction needed."));
        } else {
            audio.pause();
        }
    }, [isMuted]);

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col p-4 animate-slide-in-from-bottom" role="dialog" aria-modal="true">
            {/* NOTE: Audio file is not provided, but this demonstrates implementation. */}
            <audio ref={audioRef} src="https://storage.googleapis.com/framer-usercontent/sounds/2G3uA0A9AF2t02Pq53I8S8sAKU.mp3" loop muted={isMuted}></audio>

            <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Zen Garden</h2>
                    <p className="text-gray-500 mt-1">Create your moment of calm.</p>
                </div>
                <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors text-4xl leading-none">&times;</button>
            </header>
            <main ref={containerRef} className="flex-grow w-full relative rounded-xl overflow-hidden bg-gray-50 border shadow-inner cursor-crosshair">
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
            </main>
            <footer className="flex-shrink-0 pt-4 flex flex-col items-center gap-3">
                <div className="flex justify-center items-center gap-3 p-2 bg-black/5 backdrop-blur-sm rounded-xl">
                    <ToolButton icon="✍️" label="Fine Rake" isActive={activeTool === 'rake' && rakeType === 'fine'} onClick={() => { setActiveTool('rake'); setRakeType('fine'); }} />
                    <ToolButton icon="📜" label="Wide Rake" isActive={activeTool === 'rake' && rakeType === 'wide'} onClick={() => { setActiveTool('rake'); setRakeType('wide'); }} />
                    <ToolButton icon="🪨" label="Place Stone" isActive={activeTool === 'stone'} onClick={() => setActiveTool('stone')} />
                    <button onClick={() => setIsMuted(m => !m)} className="flex flex-col items-center justify-center p-2 rounded-lg w-20 h-20 bg-white/70 hover:bg-white transition-all">
                       <span className="text-3xl">{isMuted ? '🔇' : '🔉'}</span>
                       <span className="text-xs font-semibold mt-1">Sound</span>
                    </body >
                </div>
                 <div className="flex justify-center gap-4">
                     <button onClick={smoothSand} className="px-5 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300">Smooth Sand</button>
                     <button onClick={onComplete} className="px-5 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300">Finish</button>
                 </div>
            </footer>
        </div>
    );
};