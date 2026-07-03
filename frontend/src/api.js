const API_URL = '/api/contacts';

export const getContacts = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
};

export const createContact = async (contact, fcmToken = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (fcmToken) headers['x-fcm-token'] = fcmToken;
    const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
};

export const updateContact = async (id, contact, fcmToken = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (fcmToken) headers['x-fcm-token'] = fcmToken;
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
};

export const deleteContact = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
};