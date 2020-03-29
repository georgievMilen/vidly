const mongoose = require('mongoose');
const Joi = require('joi');
const { genderSchema } = require('./gender');

const movieShema = new mongoose.Schema ({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  gender: {
    type: genderSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  }
});

const Movie = mongoose.model('Movie', movieShema);

function validateMovie(movie) {
    const schema = {
      title: Joi.string().min(3).max(30).required(),
      genderId: Joi.objectId().required(),
      numberInStock: Joi.number().min(0),
      dailyRentalRate: Joi.number().min(0)
    };
  
    return Joi.validate(movie, schema);  
  }

  exports.Movie = Movie;
  exports.validate = validateMovie;
  exports.movieShema = movieShema;