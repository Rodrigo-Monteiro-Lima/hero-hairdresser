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
      const result = await this.userService.create({ name, email, password })
      return response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
  async auth(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;
      const result = await this.userService.auth(email, password);
      return response.json(result);
    } catch (error) {
      next(error);
    }
  }
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, oldPassword, newPassword } = request.body;
      const { user_id } = request;
      const result = await this.userService.update({
        name,
        oldPassword,
        newPassword,
        avatar_url: request.file,
        user_id,
      });
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export { UsersController };