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
  
    delete contacts.__v;
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
    
    const contact = await getContactByIdService(contactId ,);
    if (!contact) {
      const payload = {
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' }
      };
      return next(createError(payload));
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
    const newContact = await createContactService(req.body);
 
    await newContact.save();
    // Видалення поля "__v" перед створенням відповіді
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

  const result = await updateContactService( contactId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};


export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContactService(contactId, req.body);

  if (!result) {
    next(createError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.student,
  });
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