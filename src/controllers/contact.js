const { getAllContacts, getContactById } = require('../services/contacts');

const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
};

const getContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: `Contact not found with id ${contactId}`
      });
    }
    res.status(200).json({
      status: 'success',
      message: `Successfully found contact with id ${contactId}!`,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = { getContacts, getContact };
