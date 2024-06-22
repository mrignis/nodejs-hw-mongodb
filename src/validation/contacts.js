// src/validation/students.js

import Joi from 'joi';

export const createContactSchema = 
  Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().email(). default (false),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().valid('work', 'home', 'personal').default('personal'),
    photo: Joi.string().uri().optional()
});

  export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().email().required(false),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().valid('work', 'home', 'personal').default('personal'),
    photo: Joi.string().uri().optional()
});
  
