import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";
import {body} from 'express-validator';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import {PermissionFlag} from "../common/middleware/common.permissionflag.enum";
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import permissionMiddleware from '../common/middleware/common.permission.middleware'

export class UsersRoutes extends CommonRoutesConfig {

  constructor(app: express.Application) {
    super(app, 'UserRoutes');
  }

  configRoutes(): express.Application {

    this.app
      .route('/users')
      .get(
          jwtMiddleware.validJWTNeeded,
          permissionMiddleware.permissionFlagRequired(
              PermissionFlag.ADMIN_PERMISSION
          ),
          usersController.listUsers)
      .post(
        body('email').isEmail(),
        body('password')
            .isLength({min: 5})
            .withMessage('Must include password 5+ characters'),
        body('firstName').isString(),
        body('lastName').isString(),
        body('permissionFlags').isInt(),
        BodyValidationMiddleware.verifiyBodyFieldsErrors,
        usersMiddleware.validateEmailDoesntExist,
        usersController.createUser
      );
    
    this.app.param('userId', usersMiddleware.extractUserId);
    this.app
      .route('/users/:userId')
      .all(
        usersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
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
        usersMiddleware.validateSameEmailBelongsToSameUser,
        usersMiddleware.usersCantChangePermission,
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
        usersMiddleware.usersCantChangePermission,
        usersController.patch
      )
    
    return this.app;
  }
}
