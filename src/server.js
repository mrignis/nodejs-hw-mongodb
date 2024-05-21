// src/server.js
import express from 'express';
import contactRouter from './routes/contact.js';  // Доданий .js

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/contacts', contactRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

const setupServer = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
