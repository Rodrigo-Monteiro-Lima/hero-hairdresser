import { ICreate } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
  private userRepository: UsersRepository;
  constructor() {
    this.userRepository = new UsersRepository();
  }
  async create({name, email, password}: ICreate) {
    const findUser = await this.userRepository.findUserByEmail(email);
    if (findUser) {
      throw new Error('User already exists');
    }
    const result = await this.userRepository.create({name, email, password});
    return result;
  }
}

export default UsersService;