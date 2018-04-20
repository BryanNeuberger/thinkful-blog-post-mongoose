'use strict';
//Router for blogPosts

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;


router.get('/', (req, res) => {

  BlogPosts
  .find()
  .limit(25)
  .then(blogPosts => {
      res.json({
        serializedBlogPostsArray: blogPosts.map(
          (blogPosts) => blogPosts.serialize())
      })
    })
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', jsonParser, (req, res) => {

  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  BlogPosts.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
  .then(post => res.status(201).json(post.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

router.delete('/:id', (req, res) => {

  BlogPosts.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.put('/:id', jsonParser, (req, res) => {

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPosts.findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(post => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));

});

module.exports = router;
