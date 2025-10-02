import React, { useState, useEffect, useMemo, useRef } from 'react';
import { POSITIVE_WORDS } from '../constants';

interface WordSearchProps {
    onBack: () => void;
    onComplete: () => void;
}

const GRID_SIZE = 10;
const WORDS_TO_FIND = 6;

interface Cell { r: number; c: number; }
interface PlacedWord { word: string; cells: Cell[]; }

const FOUND_COLORS = [
    'bg-yellow-300', 'bg-lime-300', 'bg-cyan-300',
    'bg-pink-300', 'bg-orange-300', 'bg-violet-300'
];

// Enhanced word search generator that handles 8 directions and returns word locations
const generatePuzzle = (words: string[]): { grid: string[][], words: PlacedWord[] } => {
    const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    const placedWords: PlacedWord[] = [];

    const directions = [
        { x: 1, y: 0 }, { x: -1, y: 0 }, // Horizontal
        { x: 0, y: 1 }, { x: 0, y: -1 }, // Vertical
        { x: 1, y: 1 }, { x: -1, y: -1 }, // Diagonal down-right / up-left
        { x: 1, y: -1 }, { x: -1, y: 1 }  // Diagonal up-right / down-left
    ];

    const shuffledWords = [...words].sort(() => 0.5 - Math.random()).slice(0, WORDS_TO_FIND);

    for (const word of shuffledWords) {
        let placed = false;
        for (let i = 0; i < 100 && !placed; i++) { // Try 100 times
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);
            
            const endRow = row + (word.length - 1) * dir.y;
            const endCol = col + (word.length - 1) * dir.x;

            if (endRow >= 0 && endRow < GRID_SIZE && endCol >= 0 && endCol < GRID_SIZE) {
                let canPlace = true;
                const wordCells: Cell[] = [];
                for (let j = 0; j < word.length; j++) {
                    const newRow = row + j * dir.y;
                    const newCol = col + j * dir.x;
                    wordCells.push({ r: newRow, c: newCol });
                    if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[j]) {
                        canPlace = false;
                        break;
                    }
                }

                if (canPlace) {
                    for (let j = 0; j < word.length; j++) {
                        const { r, c } = wordCells[j];
                        grid[r][c] = word[j];
                    }
                    placed = true;
                    placedWords.push({ word, cells: wordCells });
                }
            }
        }
    }

    // Fill empty cells
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
            }
        }
    }

    return { grid, words: placedWords };
};

export const WordSearch: React.FC<WordSearchProps> = ({ onBack, onComplete }) => {
    const [{ grid, words }, setPuzzle] = useState<{ grid: string[][], words: PlacedWord[] }>({ grid: [], words: [] });
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [wordColors, setWordColors] = useState<Map<string, string>>(new Map());

    const [isSelecting, setIsSelecting] = useState(false);
    const [startCell, setStartCell] = useState<Cell | null>(null);
    const [currentSelection, setCurrentSelection] = useState<Cell[]>([]);

    useEffect(() => {
        const newPuzzle = generatePuzzle(POSITIVE_WORDS);
        setPuzzle(newPuzzle);
        
        const newColors = new Map<string, string>();
        newPuzzle.words.forEach((wordInfo, index) => {
            newColors.set(wordInfo.word, FOUND_COLORS[index % FOUND_COLORS.length]);
        });
        setWordColors(newColors);
    }, []);

    const isComplete = words.length > 0 && foundWords.length === words.length;

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(onComplete, 1500);
            return () => clearTimeout(timer);
        }
    }, [isComplete, onComplete]);

    const getSelectionFromEndpoints = (start: Cell, end: Cell): Cell[] => {
        const selection: Cell[] = [];
        const dx = end.c - start.c;
        const dy = end.r - start.r;

        if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
            const steps = Math.max(Math.abs(dx), Math.abs(dy));
            const xStep = dx === 0 ? 0 : dx / steps;
            const yStep = dy === 0 ? 0 : dy / steps;

            for (let i = 0; i <= steps; i++) {
                selection.push({ r: start.r + i * yStep, c: start.c + i * xStep });
            }
        }
        return selection;
    };

    const handleInteractionStart = (cell: Cell) => {
        if (isComplete) return;
        setIsSelecting(true);
        setStartCell(cell);
        setCurrentSelection([cell]);
    };

    const handleInteractionMove = (cell: Cell) => {
        if (isSelecting && startCell) {
            const newSelection = getSelectionFromEndpoints(startCell, cell);
            if (newSelection.length > 0) {
                setCurrentSelection(newSelection);
            }
        }
    };

    const handleInteractionEnd = () => {
        if (!isSelecting || currentSelection.length < 2) {
            setIsSelecting(false);
            setStartCell(null);
            setCurrentSelection([]);
            return;
        };

        const selectedWord = currentSelection.map(c => grid[c.r][c.c]).join('');
        const selectedWordReversed = selectedWord.split('').reverse().join('');

        const found = words.find(w => !foundWords.includes(w.word) && (w.word === selectedWord || w.word === selectedWordReversed));

        if (found) {
            setFoundWords(prev => [...prev, found.word]);
        }
        
        setIsSelecting(false);
        setStartCell(null);
        setCurrentSelection([]);
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
        if (isSelecting && startCell) {
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (element && element.getAttribute('data-cell')) {
                const [r, c] = element.getAttribute('data-cell')!.split('-').map(Number);
                handleInteractionMove({ r, c });
            }
        }
    };

    // Helper functions for styling
    const isCellInSelection = (cell: Cell) => currentSelection.some(c => c.r === cell.r && c.c === cell.c);
    const getFoundWordForCell = (cell: Cell) => words.find(w => foundWords.includes(w.word) && w.cells.some(c => c.r === cell.r && c.c === cell.c));

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col p-4 animate-slide-in-from-bottom" role="dialog" aria-modal="true">
            <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Positive Word Find</h2>
                    <p className="text-gray-500 mt-1">Find the hidden happy words.</p>
                </div>
                <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors text-4xl leading-none">&times;</button>
            </header>
            <main className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-6 overflow-y-auto">
                {grid.length === 0 ? <p>Loading puzzle...</p> : (
                    <>
                    <div 
                        className="bg-white p-2 rounded-lg shadow-lg cursor-pointer"
                        onMouseUp={handleInteractionEnd}
                        onMouseLeave={handleInteractionEnd}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleInteractionEnd}
                    >
                        <div className="grid grid-cols-10 gap-1 font-bold text-gray-700 text-center select-none" style={{ touchAction: 'none' }}>
                            {grid.map((row, r) => row.map((letter, c) => {
                                const cell = { r, c };
                                const foundWordInfo = getFoundWordForCell(cell);
                                const isFound = !!foundWordInfo;
                                const isSelected = !isFound && isCellInSelection(cell);
                                const foundColorClass = isFound ? wordColors.get(foundWordInfo.word) : '';

                                return (
                                <div 
                                    key={`${r}-${c}`} 
                                    data-cell={`${r}-${c}`}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded transition-colors duration-150
                                    ${isFound ? `${foundColorClass} text-gray-800 font-extrabold` : 'bg-sky-100'}
                                    ${isSelected ? 'bg-sky-400/80 !text-white' : ''}
                                    `}
                                    onMouseDown={() => handleInteractionStart(cell)}
                                    onMouseEnter={() => handleInteractionMove(cell)}
                                    onTouchStart={() => handleInteractionStart(cell)}
                                >
                                    {letter}
                                </div>
                                )
                            }))}
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-full sm:w-48">
                        <h3 className="text-lg font-bold text-gray-700 mb-2">Words to find:</h3>
                        <ul className="space-y-1 text-lg">
                            {words.map(({ word }) => (
                                <li key={word} className={`font-semibold transition-all duration-300 ${foundWords.includes(word) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                    {word}
                                </li>
                            ))}
                        </ul>
                        {isComplete && (
                            <div className="mt-4 text-center font-bold text-green-600 animate-fade-in text-xl">
                                🎉 All words found! 🎉
                            </div>
                        )}
                    </div>
                    </>
                )}
            </main>
        </div>
    );
};