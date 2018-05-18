const express = require('express');
const { Idea } = require('../db/models/idea_schema');
const { Comment } = require('../db/models/comment_schema');
const router = express.Router();

router
  .get('/', (req, res) => {
    Idea.query()
      .then(ideas => {
        console.log('got the ideas');
        console.log(ideas);
        res.json(ideas);
      })
      .catch(err => {
        console.log('Got an error!');
        console.error(err);
        res.json(err);
      });
  })
  .get('/:id', (req,res) => {
    Idea.query().findById(req.params.id).eager('comments')
    .then(idea => {
      console.log('got the idea');
      console.log(idea);
      res.json(idea);
    })
    .catch(err => {
      console.log('Got an error!');
      console.error(err);
      res.json(err);
    });
  })
  .post('/', (req, res) => {
    const newIdea = req.body;
    Idea.query()
      .allowInsert('[idea, creator]')
      .insert(newIdea)
      .then(idea => {
        console.log('Inserted new idea!');
        console.log(idea);
        res.send(idea);
      })
      .catch(err => {
        console.log('Got an error!');
        console.error(err);
        res.send(err);
      });
  })
  .post('/:id/comments', (req, res) => {
    Idea.query().findById(req.params.id)
      .then(idea => {
        return idea.$relatedQuery('comments')
                  .allowInsert('[comment, creator]')
                  .insert(req.body);
      })
      .then(ideaWithNewComment => {
        console.log('Made a new comment on an idea');
        console.log(ideaWithNewComment);
        res.send(ideaWithNewComment);
      })
      .catch(err => { 
        console.log('Got an error!');
        console.error(err);
        res.send(err);
      });
  })
  .delete('/:id', (req, res) => { 
    Idea.query().deleteById(req.params.id)
      .then(result => {
        console.log('Deleted an idea :(');
        console.log(result);
        res.redirect('/ideas');
      })
      .catch(err => {
        console.log('Got an error!');
        console.error(err);
        res.send(err);
      });
  })
  .delete(':id/comments/:commentId', (req, res) => { 
    Comment.query().deleteById(req.params.commentId)
      .then(result => {
        console.log('Deleted a comment!');
        console.log(result);
        res.redirect(`/ideas/${req.params.id}`);
      })
      .catch(err => {
        console.log('Got an error!');
        console.error(err);
        res.send(err);
      });
  });

  module.exports = router;