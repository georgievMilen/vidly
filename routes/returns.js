const Joi = require('joi');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const validate = require('../middleware/validate');


router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);


  
  if (!rental) return res.status(404).send('No rental found for the customer/movie');

  if(rental.dateReturned) return res.status(400).send('Return already processed.');
  
  rental.return();
  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1}
  });
  
  res.send(rental);
});


function validateReturn(req) {
  const schema = {
    customerId: Joi.ObjectId().required(),
    movieId: Joi.ObjectId().required()
  };
  
  return Joi.validate(gender, schema);  
}

module.exports = router