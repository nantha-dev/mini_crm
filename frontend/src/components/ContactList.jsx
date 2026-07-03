import React from 'react';
import { Button } from '../App';

export default function ContactList({ contacts, loading, onEdit, onDelete }) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
                <p className="mt-4 text-sm font-medium">Loading contacts...</p>
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-slate-700">No contacts yet</h3>
                <p className="text-sm text-slate-500 mt-1">Click “Add Contact” to start building your CRM.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map(contact => (
                <div key={contact.id} className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-800 truncate">{contact.name}</h3>
                            <p className="text-sm text-slate-600 truncate">{contact.email}</p>
                            {contact.phone && (
                                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                    <span>📞</span> {contact.phone}
                                </p>
                            )}
                            {contact.company && (
                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                    <span>🏢</span> {contact.company}
                                </p>
                            )}
                        </div>
                        <div className="flex-shrink-0 ml-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm">
                                {contact.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                        <Button variant="outline" onClick={() => onEdit(contact)} className="text-sm px-3 py-1.5">
                            ✏️ Edit
                        </Button>
                        <Button variant="danger" onClick={() => onDelete(contact.id)} className="text-sm px-3 py-1.5">
                            🗑️ Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}