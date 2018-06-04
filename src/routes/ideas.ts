import { Router, Request as  Req, Response as Res} from 'express';
import { Idea, Comment } from '../db/models/idea_schema';
const router = Router();

// Middleware function for entire /ideas API to make sure the user is logged in to access these routes
function authenticated(req: Req, res: Res, next){
  if(req.user){
    next();
  } else {
    res.redirect('/');
  }
}

router.use(authenticated);

/**
 * API routes for /idea
 * GET:
 *      /               :Get all the ideas and display them
 *      /:id            :Get the specified idea and display it with comments
 * POST:
 *      /               :Add a new idea
 *      /:id/comments   :Add a comment to specified idea
 */

router
  .get('/', (req: Req, res: Res) => {
    Idea.query()
      .then(ideas => {
        const message = req.flash('success');
        const signedIn = req.flash('signedIn');
        res.status(200).render('ideas', 
          {
            ideas: ideas, 
            message: message, 
            signedIn: signedIn
          }
        );
      })
      .catch(err => {
        console.log('Got an error!');
        console.error(err);
        res.status(400).render('ideas', {error: err.message});
      });
  })
  .get('/:id', (req: Req, res: Res) => {
    Idea.query().findById(req.params.id).eager('comments')
    .then(idea => {
      res.render('oneIdea', {idea});
    })
    .catch(err => {
      console.log('Got an error!');
      console.error(err);
      res.render('ideas', {error: err});
    });
  })
  .post('/', (req: Req, res: Res) => {
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
  .post('/:id/comments', (req: Req, res: Res) => {
    Idea.query().findById(req.params.id)
      .then(idea => {
        return idea.$relatedQuery('comment')
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
  });



export default router;