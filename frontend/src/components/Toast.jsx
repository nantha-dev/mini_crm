import React from 'react';

export default function Toast({ message, type = 'info', onClose }) {
    const bg = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-slate-800';
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    return (
        <div className={`fixed bottom-6 right-6 ${bg} text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 max-w-sm animate-slide-up`}>
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="text-white/60 hover:text-white text-xl leading-none ml-2 transition-colors">&times;</button>
        </div>
    );
}