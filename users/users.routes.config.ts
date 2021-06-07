import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";

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
        usersMiddleware.validateRequiredUserBodyFields,
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
        usersMiddleware.validateRequiredUserBodyFields,
        usersMiddleware.validateSameEmailBelongsToSameUser,
        usersController.put
      )
      .patch(
        usersMiddleware.validatePatchEmail,
        usersController.patch
      )
    
    return this.app;
  }
}