const Joi = require('joi');
const mongoose = require('mongoose');

const genderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Gender = mongoose.model('Gender', genderSchema);

function validateGender(gender) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };
  
  return Joi.validate(gender, schema);  
}
 
  exports.validate = validateGender;
  exports.genderSchema = genderSchema
  exports.Gender = Gender;