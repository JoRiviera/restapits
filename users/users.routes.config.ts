import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";
import {body} from 'express-validator';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';

export class UsersRoutes extends CommonRoutesConfig {

  constructor(app: express.Application) {
    super(app, 'UserRoutes');
  }

  configRoutes(): express.Application {

    /**
     * @TODO Route Config
    */
    this.app
      .route('/users')
      .get(usersController.listUsers)
      .post(
        body('email').isEmail(),
        body('password')
            .isLength({min: 5})
            .withMessage('Must include password 5+ characters'),
        body('firstName').isString(),
        body('lastName').isString,
        body('permissionFlags').isInt(),
        BodyValidationMiddleware.verifiyBodyFieldsErrors,
        usersMiddleware.validateEmailDoesntExist,
        usersController.createUser
      );
    
    this.app.param('userId', usersMiddleware.extractUserId);
    this.app
      .route('/users/:userId')
      .all(usersMiddleware.validateUserExists)
      .get(usersController.getUserById)
      .delete(usersController.delete)
      .put(
        body('email').isEmail(),
        body('password')
            .isLength({min: 5})
            .withMessage('Must include password 5+ characters'),
        body('firstName').isString(),
        body('lastName').isString,
        body('permissionFlags').isInt(),
        BodyValidationMiddleware.verifiyBodyFieldsErrors,
        usersMiddleware.validateRequiredUserBodyFields,
        usersMiddleware.validateSameEmailBelongsToSameUser,
        usersController.put
      )
      .patch(
        body('email').isEmail().optional(),
        body('password')
            .isLength({min: 5})
            .withMessage('Must include password 5+ characters')
            .optional(),
        body('firstName').isString().optional(),
        body('lastName').isString().optional(),
        body('permissionFlags').isInt().optional(),
        BodyValidationMiddleware.verifiyBodyFieldsErrors,
        usersMiddleware.validatePatchEmail,
        usersController.patch
      )
    
    return this.app;
  }
}
