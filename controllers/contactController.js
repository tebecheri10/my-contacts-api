const asyncHandler = require("express-async-handler");
const Contact = require('../models/contactModel')

const getContacts = asyncHandler(async (req, res) => {

  const contacts = await Contact.find({ user_id: req.user.id});

  res.status(200).json({
    contacts
  });
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("all fields are mandatory");    
  }

  const contacts = await Contact.create({
     name: name,
     email: email,
     phone: phone,
     user_id: req.user.id
  });

  res.status(201).json({
    messge: "Creacte contact ",
    payload: contacts
  });
});

const getContact = asyncHandler(async (req, res) => {

  const contact = await Contact.findById(req.user.id);

  if(!contact){
    res.status(404)
    throw new Error("contact not found")
  }


  res.status(200).json({
    message: `Get single contact for ID: ${req.params.id} `,
    contact: contact
  });
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)

  if(!contact){
    res.send(404);
    throw new Error("Contact not found")
  }
  if(contact.user_id.toString() !== req.user.id){
    res.send(403)
    throw new Error("user dont't have permission to update other user contacts")
  }
  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true})

  res.status(200).json({
    response: `update contact for ${req.params.id} `,
    updatedData: updatedContact
  });
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
 
  if(!contact){
    res.send(404);
    throw new Error("Contact not found")
  }
  
  if(contact.user_id.toString() !== req.user.id){
    res.send(403)
    throw new Error("user dont't have permission to update other user contacts")
  }

  const deletedUser = await Contact.deleteOne({_id: req.params.id})
  console.log("deletedUser", deletedUser)
  res.status(200).json({
    response: `delete contact for ${req.params.id} `,
    deletedContact: deletedUser
  });
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
