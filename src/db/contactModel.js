// src/db/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String  ,  required: false, },
  isFavourite: { type: Boolean, default: false },
  contactType: {
    type: String,
    enum: ['work', 'home', 'personal'],
    default: 'personal',
   
  },
}, {versionKey: false , timestamps: true});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
