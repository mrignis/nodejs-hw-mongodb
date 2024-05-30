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
    const contacts = await getAllContactsService({}, '-__v');
    const cleanedContacts = contacts.map(contact => {
      const contactObj = contact.toObject();
      delete contactObj.__v;
      return contactObj;
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: cleanedContacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await getContactByIdService(contactId, '-__v');
    if (!contact) {
      const payload = {
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' }
      };
      return next(createError(payload));
    }
    const contactObj = contact.toObject();
    delete contactObj.__v;

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contactObj,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    let newContact = await createContactService(req.body);
    newContact = newContact.toObject();
    delete newContact.__v;

    const payload = {
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    };
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await updateContactService(contactId, req.body, {
      upsert: true,
      new: true,
      select: '-__v'
    });

    if (!result) {
      next(createError(404, 'Contact not found'));
      return;
    }

    const status = result.isNew ? 201 : 200;
    const contactObj = result.toObject();
    delete contactObj.__v;

    res.status(status).json({
      status,
      message: `Successfully upserted a contact!`,
      data: contactObj,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await updateContactService(contactId, req.body, {
      new: true,
      select: '-__v'
    });

    if (!result) {
      next(createError(404, 'Contact not found'));
      return;
    }

    const contactObj = result.toObject();
    delete contactObj.__v;

    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: contactObj,
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
      const payload = {
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' }
      };
      return next(createError(payload));
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
