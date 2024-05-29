import createError from 'http-errors';
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from '../services/contact.js';

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContactsService();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await getContactByIdService(contactId);
    if (!contact) {
      return next(createError(404, 'Contact not found', { message: 'Contact not found' }));
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber } = req.body;

    // Перевірка обов'язкових полів
    if (!name || !phoneNumber) {
      return next(createError(400, 'Name and phoneNumber are required fields.'));
    }

    // Створення нового контакту
    const newContact = await createContactService(req.body);

    // Повернення відповіді з кодом статусу 201 та об'єктом даних нового контакту
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const updatedContact = await updateContactService(contactId, req.body);
    if (!updatedContact) {
      return next(createError(404, 'Contact not found', { message: 'Contact not found' }));
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deletedContact = await deleteContactService(contactId);
    if (!deletedContact) {
      return next(createError(404, 'Contact not found', { message: 'Contact not found' }));
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Функція для перевірки правильності формату електронної пошти

