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
  const { name, phoneNumber, email, isFavourite, contactType } = contactData;
  const newContact = new Contact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });
  await newContact.save();
  return newContact;
};

export const updateContactService = async (contactId, updates) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, updates, { new: true });
  return updatedContact;
};

export const deleteContactService = async (id) => {
  const deletedContact = await Contact.findByIdAndDelete(id);
  return deletedContact;
};
