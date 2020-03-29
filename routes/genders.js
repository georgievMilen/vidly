const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Gender, validate } = require('../models/gender');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const genders = await Gender.find().sort('name');
  res.send(genders);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const gender = new Gender({ name: req.body.name });
  await gender.save();

  res.send(gender);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } =  validate(req.body); 
  if(error) return res.status(400).send(error.details[0].message);

  const gender = await Gender.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
    new: true
  });

  if(!gender) return res.status(404).send('The gender with the given ID was not found.');

  res.send(gender);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const gender = await Gender.findByIdAndRemove(req.params.id);

  if(!gender) return res.status(404).send('The gender with the given ID was not found.');
  
  res.send(gender);
});

router.get('/:id',validateObjectId, async(req, res) => {
  
  const gender = await Gender.findById(req.params.id);
    
  if(!gender) return res.status(404).send('The gender was not found.');
  
  res.send(gender);
});


module.exports = router;