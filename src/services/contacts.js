import Contact from '../db/Contact.js';

export async function getAllContacts() {
    return await Contact.find({});
}

export async function getContactById(contactId) {
    return await Contact.findById(contactId);
}
