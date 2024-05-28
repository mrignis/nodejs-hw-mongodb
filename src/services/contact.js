import Contact from '../db/contactModel.js';

export const getAllContactsService = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactByIdService = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContactService = async (contactData) => {
  const newContact = new Contact(contactData);
  await newContact.save();
  return newContact;
};

export const updateContactService = async (contactId, updates) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, updates, { new: true });
  return updatedContact;
};

export const deleteContactService = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
};
