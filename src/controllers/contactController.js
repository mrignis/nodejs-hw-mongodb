import mongoose from 'mongoose';
import { getAllContactsService, getContactByIdService } from '../services/contact.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await getAllContactsService();
    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  // Перевірка на дійсний ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid contact ID format',
    });
  }

  try {
    const contact = await getContactByIdService(contactId);
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: `Contact with id ${contactId} not found`,
      });
    }
    res.status(200).json({
      status: 'success',
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to retrieve contact with id ${contactId}`,
      error: error.message,
    });
  }
};
