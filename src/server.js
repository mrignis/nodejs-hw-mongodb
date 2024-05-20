const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const { getAllContacts, getContactById } = require('./services/contacts');

function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(pino);

  app.get('/contacts', async (req, res) => {
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
        message: 'Failed to get contacts',
        error: error.message
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const contact = await getContactById(req.params.contactId);
      if (contact) {
        res.status(200).json({
          status: 'success',
          message: `Successfully found contact with id ${req.params.contactId}!`,
          data: contact
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: 'Contact not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to get contact',
        error: error.message
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = setupServer;
