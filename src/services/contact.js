// src/services/contacts.js

import Contact from '../db/contactModel.js';
import createError from 'http-errors';

export const getAllContactsService = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactByIdService = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContactService = async (payload) => {
  const { name, phoneNumber, email, isFavourite, contactType } = payload;
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





export const upsertContactService = async (id, payload, options = {}) => {
  const rawResult = await Contact.findByIdAndUpdate(id, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) {
    throw createError(404, 'Contact not found');
  }

  return {
    contact: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};


export const deleteContactService = async (id) => {
  const deletedContact = await Contact.findByIdAndDelete(id);
  return deletedContact;
};
