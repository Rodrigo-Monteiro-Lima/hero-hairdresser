import { Router } from 'express';
class UsersRoutes {
  private router: Router;
  constructor() {
    this.router = Router();
  }
  getRoutes(): Router {
    return this.router;
  }
}

export { UsersRoutes };