import React, { useState } from 'react';
import { JournalEntry } from '../types';

interface JournalHistoryProps {
  entries: JournalEntry[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const JournalHistory: React.FC<JournalHistoryProps> = ({ entries, onClose, onDelete }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      onDelete(entryToDelete.id);
      if (selectedEntry?.id === entryToDelete.id) {
        setSelectedEntry(null);
      }
      setEntryToDelete(null);
    }
  };

  const renderListView = () => (
    <div className="space-y-3 pb-4">
      {[...entries].reverse().map((entry) => (
        <div key={entry.id} className="relative group bg-amber-50/80 p-3 rounded-lg border border-amber-200/80 shadow-sm animate-fade-in transition-shadow hover:shadow-md">
          <div onClick={() => setSelectedEntry(entry)} className="cursor-pointer pr-8">
            <p className="text-xs font-semibold text-amber-800 mb-1">{formatDate(entry.date)}</p>
            <p className="text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">{entry.text}</p>
          </div>
          <button 
            onClick={() => setEntryToDelete(entry)} 
            className="absolute top-1/2 -translate-y-1/2 right-2 p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Delete entry"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      ))}
    </div>
  );

  const renderDetailView = () => (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex-shrink-0 mb-4 flex justify-between items-center">
        <button onClick={() => setSelectedEntry(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          Back to Journal
        </button>
        <button 
          onClick={() => setEntryToDelete(selectedEntry)} 
          className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
          aria-label="Delete entry"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
      <div className="flex-grow overflow-y-auto bg-amber-50/80 p-4 rounded-lg border border-amber-200/80">
        <p className="text-sm font-semibold text-amber-800 mb-2">{formatDate(selectedEntry!.date)}</p>
        <p className="text-gray-700 whitespace-pre-wrap">{selectedEntry!.text}</p>
      </div>
    </div>
  );
  
  const renderDeleteConfirmation = () => (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 animate-fade-in-fast">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
        <p className="text-gray-600 my-4">Are you sure you want to permanently delete this journal entry?</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => setEntryToDelete(null)} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition">
            Cancel
          </button>
          <button onClick={handleConfirmDelete} className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col p-4 animate-slide-in-from-bottom" role="dialog" aria-modal="true">
      <header className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-3xl font-bold text-gray-800">
          {selectedEntry ? "Journal Entry" : "My Journal"}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-4xl leading-none" aria-label="Close journal">&times;</button>
      </header>
      <main className="flex-grow overflow-y-auto relative">
        {entries.length === 0 && !selectedEntry ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <span className="text-5xl mb-4">✍️</span>
            <h3 className="text-xl font-semibold">Your journal is empty.</h3>
            <p className="max-w-xs">Complete a "Journal" activity to save your thoughts and reflections here.</p>
          </div>
        ) : (
            selectedEntry ? renderDetailView() : renderListView()
        )}
      </main>

      {entryToDelete && renderDeleteConfirmation()}

       <style>{`
          @keyframes slide-in-from-bottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-in-from-bottom { animation: slide-in-from-bottom 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
          .animate-fade-in-fast { animation: fade-in 0.2s ease-out forwards; }
          .text-ellipsis { text-overflow: ellipsis; }
       `}</style>
    </div>
  );
};