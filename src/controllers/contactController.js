import mongoose from 'mongoose';
import { getAllContactsService, getContactByIdService } from '../services/contact.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await getAllContactsService();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: error.message,
    });
  }
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  // Перевірка на дійсний ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid contact ID format',
    });
  }

  try {
    const contact = await getContactByIdService(contactId);
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id ${contactId} not found`,
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `Failed to retrieve contact with id ${contactId}`,
      error: error.message,
    });
  }
};
