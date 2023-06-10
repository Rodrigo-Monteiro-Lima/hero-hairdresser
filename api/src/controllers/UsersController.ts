import { NextFunction, Request, Response } from 'express';

class UsersController {
  index() {
    //buscar todos
  }
  show() {
    //buscar somente um
  }
  async store(request: Request, response: Response, next: NextFunction) {
  }
  async auth(request: Request, response: Response, next: NextFunction) {
  }
}

export { UsersController };