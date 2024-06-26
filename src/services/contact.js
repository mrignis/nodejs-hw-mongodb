// src/services/contact.js
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
  userId
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;



  const [contactsCount, contacts] = await Promise.all([
    Contact.find({ ...filter, userId }).countDocuments(),
    Contact.find({ ...filter, userId })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts, ...paginationData };
};


/**
 * Get a contact by ID and userId
 * @param {string} contactId - Contact ID
 * @param {string} userId - User ID
 * @returns {Object} - Contact data
 */
export const getContactByIdService = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId }).lean();
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  delete contact.__v;
  return contact;
};

/**
 * Create a new contact
 * @param {Object} payload - Contact data
 * @returns {Object} - Created contact data
 */


export const createContactService = async (payload) => {
  const { name, phoneNumber, email, isFavourite, contactType, userId,photo } = payload;
  const newContact = new Contact({
    photo,
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
/**
 * Update or insert a contact
 * @param {string} id - Contact ID
 * @param {Object} payload - Contact data
 * @param {string} userId - User ID
 * @param {Object} options - Options for update
 * @returns {Object} - Updated contact data and flag indicating if it's new
 */
// src/services/contactService.js


export const upsertContactService = async (id, payload, userId, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: id, userId },
    payload, 
    {
      new: true,
      upsert: true,
      ...options,
    }
  ).lean();

  if (!rawResult) {
    throw createError(404, 'Contact not found');
  }

  delete rawResult.__v;

  return {
    contact: rawResult,
    isNew: !rawResult.updatedExisting, // Updated logic to check if it's a new contact
  };
};

/**
 * Delete a contact
 * @param {string} id - Contact ID
 * @param {string} userId - User ID
 * @returns {Object} - Deleted contact data
 */
export const deleteContactService = async (id, userId) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: id, userId }).lean();  // Додаємо userId
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }
  delete deletedContact.__v;
  return deletedContact;
};
