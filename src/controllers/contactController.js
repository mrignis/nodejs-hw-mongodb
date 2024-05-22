/* eslint-disable no-unused-vars */
import { getAllContacts as getAllContactsService, getContactById as getContactByIdService } from '../services/contactService.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await getAllContactsService();
    res.json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get contacts' });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);
    if (contact) {
      res.json({
        status: 'success',
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
      });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Failed to get contact' });
  }
};
