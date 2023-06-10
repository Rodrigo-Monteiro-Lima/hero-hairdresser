import { NextFunction, Request, Response } from 'express';
import UsersService from '../services/UsersServices';

class UsersController {
  private userService: UsersService;
  constructor() {
    this.userService = new UsersService();
  }
  index() {
    //buscar todos
  }
  show() {
    //buscar somente um
  }
  async store(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, email, password } = request.body
      const result = this.userService.create({ name, email, password })
      return response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
  async auth(request: Request, response: Response, next: NextFunction) {
  }
}

export { UsersController };