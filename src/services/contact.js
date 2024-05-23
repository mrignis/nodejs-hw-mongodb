import Contact from '../db/contactModel.js';



 export const getAllContacts = async () => {
   const contact = await Contact.find();
   return contact;
 };
 
 export const getContactById = async (contactId) => {
   const student = await Contact.findById(contactId);
   return student;
 };
 