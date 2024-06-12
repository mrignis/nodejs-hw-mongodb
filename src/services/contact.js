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

  const contactsQuery = Contact.find(filter).lean(); // Використовуємо фільтр

  const contactsCount = await Contact.countDocuments(filter);

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

export const getContactByIdService = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId }).lean();  // Додаємо userId
  if (contact) {
    delete contact.__v;
  }
  return contact;
};

export const createContactService = async (payload) => {
  const { name, phoneNumber, email, isFavourite, contactType, userId } = payload;
  const newContact = new Contact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId,
  });
  await newContact.save();
  const createdContact = newContact.toObject();
  delete createdContact.__v;
  return createdContact;
};

export const upsertContactService = async (id, payload, userId, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: id, userId },  // Додаємо userId
    payload, 
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  ).lean();

  if (!rawResult) {
    throw createError(404, 'Contact not found');
  }

  delete rawResult.__v;

  return {
    contact: rawResult,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContactService = async (id, userId) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: id, userId }).lean();  // Додаємо userId
  if (deletedContact) {
    delete deletedContact.__v;
  }
  return deletedContact;
};
