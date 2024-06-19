import mongoose from 'mongoose';
import {
  getAllContacts,
  getContactByIdService,
  createContactService,
  upsertContactService,
  deleteContactService,
} from '../services/contact.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { uploadToCloudinary } from '../services/cloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);

export const getAllContactsService = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = {
    name: req.query.name,
    email: req.query.email,
    isFavourite: req.query.isFavourite !== undefined ? req.query.isFavourite === 'true' : undefined,
    userId: req.user._id,
  };

  try {
    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactByIdService(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res, next) => {
  try {
    let photoUrl = null;

    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path);
    }

    const newContact = await createContactService({ ...req.body, userId: req.user._id, photo: photoUrl });

    const payload = {
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    };
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  const { body } = req;
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    return res.status(404).json({
      status: 404,
      message: 'Invalid contact ID format',
    });
  }

  try {
    let photoUrl = body.photo || null;

    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path);
    }

    const { isNew, contact } = await upsertContactService(contactId, { ...body, photo: photoUrl }, req.user._id, {
      upsert: true,
    });

    const status = isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: `Successfully upserted contact!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const result = await updateContactController(contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a student!`,
    data: result.student,
  });
};
export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid contact ID format',
    });
  }

  try {
    const deletedContact = await deleteContactService(contactId, req.user._id);
    if (!deletedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
