import Contact from '../db/contactModel.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find({});
    return contacts;
  } catch (error) {
    throw new error('Failed to fetch contacts');
  }
};
