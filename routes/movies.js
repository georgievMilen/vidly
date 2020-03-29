const auth = require('../middleware/auth');
const { Movie, validate } = require('../models/movie');
const { Gender } = require('../models/gender');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
  });
  
  router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error)  return res.status(400)
      .send(error.details[0].message);

    const gender = await Gender.findById(req.body.genderId);
    if(!gender) return res.status(400)
      .send('Invalid gender.');

    const movie = new Movie({ 
      title: req.body.title,
      gender: {
          _id: gender._id,
          name: gender.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    
    await movie.save();
  
    res.send(movie);
  });
  
  router.put('/:id', auth, async (req, res) => {
    const { error } =  validate(req.body); 
    if(error) return res.status(400).send(error.details[0].message);

    const gender = await Gender.findById(req.body.genderId);
    if(!gender) return res.status(400).send('Invalid gender.');
  
    const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      gender: {
        _id: gender._id,
        name: gender.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });
  
    if(!movie) return res.status(404).send('The movie with the given ID was not found.');
  
    res.send(movie);
  });
  
  router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
  
    if(!movie) return res.status(404).send('The movie with the given ID was not found.');
    
    res.send(movie);
  });
  
  router.get('/:id', async(req, res) => {
    const movie = await Movie.findById(req.params.id);
      
    if(!movie) return res.status(404).send('The gender was not found.');
    
    res.send(movie);
  });
    
  module.exports = router;