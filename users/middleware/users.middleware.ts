import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';
import { error } from 'winston';

const log: debug.IDebugger = debug('app:users-middleware');

class UsersMiddleware {

  async validateEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) { 
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
      res.status(400).send({ error: 'User email already exists.' });
    } else {
      next();
    }
  }

  async validateSameEmailBelongsToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserByEmail(req.body.email);
    if (user && req.params.userId == user._id) {
      next();
    } else {
      res.status(400).send({ error: 'Invalid email.'})
    }
  }

  validatePatchEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body.email) {
      log('Validating email', req.body.email);
      this.validateSameEmailBelongsToSameUser(req, res, next);
    } else {
      next();
    }
  }

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.readById(req.params.userId);
    if (user) {
      next();
    } else {
      res.status(404).send({ error: `User ${req.params.userId} does not exists.` });
    }
  }

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }

}


export default new UsersMiddleware();
