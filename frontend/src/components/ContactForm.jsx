import React, { useState } from 'react';
import { Button } from '../App';

export default function ContactForm({ initialData, onSave, onCancel }) {
    const [form, setForm] = useState(initialData);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) {
            alert('Name and email are required');
            return;
        }
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all"
                    placeholder="e.g. Jane Doe"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all"
                    placeholder="jane@example.com"
                    required
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone Number
                </label>
                <input
                    id="phone"
                    type="tel"
                    value={form.phone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all"
                    placeholder="+1 234 567 890"
                />
            </div>
            <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Company
                </label>
                <input
                    id="company"
                    type="text"
                    value={form.company || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all"
                    placeholder="Acme Inc."
                />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
                <Button type="submit">💾 Save Contact</Button>
            </div>
        </form>
    );
}