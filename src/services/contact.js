import Contact from '../db/contactModel.js';

export const getAllContactsService = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (Error) {
    throw new Error('Failed to retrieve contacts');
  }
};

export const getContactByIdService = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (Error) {
    throw new Error('Failed to retrieve contact');
  }
};
