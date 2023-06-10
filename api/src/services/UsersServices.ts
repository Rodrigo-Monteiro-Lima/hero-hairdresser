import { ICreate } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UsersRepository";
import { compare, hash } from 'bcrypt';

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
    const passwordHash = await hash(password, 10);
    const newUser = await this.userRepository.create({name, email, password: passwordHash});
    return newUser;
  }
}

export default UsersService;