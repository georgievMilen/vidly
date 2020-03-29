const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30
      },
    isGold: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 15
    }
  }));

  function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(3).max(30).required(),
      phone: Joi.string().min(6).max(13).required(),
      isGold: Joi.boolean()
    };
  
    return Joi.validate(customer, schema);  
  }
  
  exports.Customer = Customer;
  exports.validate = validateCustomer;