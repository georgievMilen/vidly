const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 255
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024
    },
    isAdmin: Boolean
  });

  userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
  }
  
  const User = mongoose.model('Users', userSchema);
  
  function validateUser(user){
    const schema = {
      name: Joi.string().required().min(3).max(255),
      email: Joi.string().required().email().min(3).max(255),
      password: Joi.string().required().min(3).max(255)
    }

    return Joi.validate(user, schema);
  };

  exports.User = User;
  exports.validate = validateUser;
