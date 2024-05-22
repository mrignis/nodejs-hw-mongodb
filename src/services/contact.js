import Contact from '../db/contactModel.js';

export const getContacts = async () => {
  return Contact.find();
};
