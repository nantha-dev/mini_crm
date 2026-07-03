import React, { useState, useEffect, useCallback } from 'react';
import { getContacts, createContact, updateContact, deleteContact } from './api';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import Toast from './components/Toast';
// optional, but we'll use emojis for simplicity

// Reusable shadcn/ui styled components
export function Button({ children, onClick, variant = 'primary', type = 'button', disabled, className = '' }) {
    const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:shadow-md',
        outline: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
        danger: 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:shadow-md',
        success: 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:shadow-md',
        ghost: 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100',
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant] || variants.primary} ${className}`}
        >
            {children}
        </button>
    );
}

export function Dialog({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
                {title && (
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none transition-colors">&times;</button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

function App() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingContact, setEditingContact] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadContacts = useCallback(async () => {
        try {
            const data = await getContacts();
            setContacts(data);
        } catch (err) {
            showToast('Error loading contacts', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadContacts();
    }, [loadContacts]);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const sendReminderNotification = (contact) => {
        if (!('Notification' in window)) {
            showToast('Notifications not supported', 'error');
            return;
        }
        if (Notification.permission === 'granted') {
            new Notification('📅 Follow‑up Reminder', {
                body: `Remember to follow up with ${contact.name} (${contact.company || 'No company'})`,
                icon: 'https://img.icons8.com/color/48/000000/calendar--v1.png',
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    sendReminderNotification(contact);
                }
            });
        }
    };

    const handleSave = async (contactData) => {
        try {
            if (editingContact) {
                const updated = await updateContact(editingContact.id, contactData);
                setContacts(contacts.map(c => c.id === updated.id ? updated : c));
                showToast('Contact updated!', 'success');
                sendReminderNotification(updated);
            } else {
                const newContact = await createContact(contactData);
                setContacts([...contacts, newContact]);
                showToast('Contact added!', 'success');
                sendReminderNotification(newContact);
            }
            setShowForm(false);
            setEditingContact(null);
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this contact?')) return;
        try {
            await deleteContact(id);
            setContacts(contacts.filter(c => c.id !== id));
            showToast('Contact deleted', 'info');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingContact(null);
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Navbar */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 text-white p-2 rounded-xl">
                            <span className="text-xl">📇</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Mini CRM</h1>
                        <span className="hidden sm:inline text-xs font-medium bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">v1.0</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-shadow"
                            />
                        </div>
                        <Button onClick={() => { setEditingContact(null); setShowForm(true); }}>
                            <span>➕</span> Add Contact
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <ContactList
                    contacts={filteredContacts}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>

            {/* Modal */}
            <Dialog open={showForm} onClose={handleCancel} title={editingContact ? '✏️ Edit Contact' : '➕ New Contact'}>
                <ContactForm
                    initialData={editingContact || { name: '', email: '', phone: '', company: '' }}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </Dialog>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

export default App;