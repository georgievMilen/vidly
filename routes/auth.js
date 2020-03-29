const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models/user');
const config = require('config');
const Joi = require('joi');


router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid user or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid user or password.');

  const token = user.generateAuthToken();
  res.send(token);
 });

function validate(req){
    const schema = {
      email: Joi.string().required().email().min(3).max(255),
      password: Joi.string().required().min(3).max(255)
    }

    return Joi.validate(req, schema);
  };

module.exports = router;