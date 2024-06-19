// src/db/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  photo: { type: String },
  email: { type: String  ,  required: false, },
  isFavourite: { type: Boolean, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contactType: {
    type: String,
    enum: ['work', 'home', 'personal'],
    default: 'personal',
   
  },
}, {versionKey: false , timestamps: true});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
