const API_URL = '/api/contacts';

export const getContacts = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
};

export const createContact = async (contact) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
};

export const updateContact = async (id, contact) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
};

export const deleteContact = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
};