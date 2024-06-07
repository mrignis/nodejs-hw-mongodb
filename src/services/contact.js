
// src/services/contacts.js

import Contact from '../db/contactModel.js';
import createError from 'http-errors';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER, KEYS_OF_CONTACT } from '../constants/index.js';
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = KEYS_OF_CONTACT._id,
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find().lean(); // додано .lean()

  // Додаємо умови фільтрації за полями
  if (filter.name) {
    contactsQuery.where('name').regex(new RegExp(filter.name, 'i')); // Пошук за частковим співпадінням (case-insensitive)
  }
  if (filter.email) {
    contactsQuery.where('email').regex(new RegExp(filter.email, 'i'));
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsCount = await Contact.countDocuments(contactsQuery);


  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { 
    data: contacts.map(contact => {
      delete contact.__v;
      return contact;
    }), 
    ...paginationData 
  };
};


export const getContactByIdService = async (contactId) => {
  const contact = await Contact.findById(contactId).lean(); // додано .lean()
  if (contact) {
    delete contact.__v;
  }
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
  const createdContact = newContact.toObject();
  delete createdContact.__v;
  return createdContact;
};

export const upsertContactService = async (id, payload, options = {}) => {
  const rawResult = await Contact.findByIdAndUpdate(id, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  }).lean(); // додано .lean()

  if (!rawResult) {
    throw createError(404, 'Contact not found');
  }

  delete rawResult.__v;

  return {
    contact: rawResult,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContactService = async (id) => {
  const deletedContact = await Contact.findByIdAndDelete(id).lean(); // додано .lean()
  if (deletedContact) {
    delete deletedContact.__v;
  }
  return deletedContact;
};
