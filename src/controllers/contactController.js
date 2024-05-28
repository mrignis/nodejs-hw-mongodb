import mongoose from 'mongoose';
import { getAllContactsService, getContactByIdService } from '../services/contact.js';

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

  // Перевірка на дійсний ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid contact ID format',
      data: null,
    });
  }

  try {
    const contact = await getContactByIdService(contactId);
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id ${contactId} not found`,
        data: null,
      });
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
