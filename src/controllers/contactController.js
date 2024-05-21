// controllers/contactController.js
import Contact from '../models/contactModel.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
