import userRoute from "./users";
import ideaRoute from "./ideas";
import { Request as Req, Response as Res, Express as App } from 'express';
import { PassportStatic } from 'passport';

export default function (app: App, passport: PassportStatic) {
  app.use('/users', userRoute);
  app.use('/ideas', ideaRoute);
  app.get('/', (req: Req, res: Res, next) => {
    const error = req.flash('error');
    res.render('home', { loggedIn: req.user ? true : false, error: error });
  });
}