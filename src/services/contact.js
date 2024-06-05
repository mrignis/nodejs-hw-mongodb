/* eslint-disable no-unused-vars */
// src/services/contacts.js

import Contact from '../db/contactModel.js';
import createError from 'http-errors';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import {  SORT_ORDER,KEYS_OF_CONTACT } from '../constants/index.js';



export const getAllContacts = async ({
  page = 1,
  perPage = 3,
  sortBy = KEYS_OF_CONTACT._id,
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();
  const contactsCount = await Contact.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts, ...paginationData };
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
