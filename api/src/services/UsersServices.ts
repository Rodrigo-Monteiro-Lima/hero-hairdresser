import { ICreate, IUpdate } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UsersRepository";
import { compare, hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { s3 } from '../config/aws';
import { sign, verify } from 'jsonwebtoken';

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
  async update({
    name,
    oldPassword,
    newPassword,
    avatar_url,
    user_id,
  }: IUpdate) {
    let password;
    if (oldPassword && newPassword) {
      const findUserById = await this.userRepository.findUserById(user_id);
      if (!findUserById) {
        throw new Error('User not found');
      }
      const passwordMatch = await compare(oldPassword, findUserById.password);
      if (!passwordMatch) {
        throw new Error('Invalid password.');
      }
      password = await hash(newPassword, 10);
      await this.userRepository.updatePassword(password, user_id);
    }
    if (avatar_url) {
      const uploadImage = avatar_url?.buffer;
      const uploadS3 = await s3
        .upload({
          Bucket: 'hero-db',
          Key: `${uuid()}-${avatar_url?.originalname}`,
          Body: uploadImage,
        })
        .promise();

      await this.userRepository.update(name, uploadS3.Location, user_id);
    }
    return {
      message: 'User updated successfully',
    };
  }
  async auth(email: string, password: string) {
    console.log(email, password);
    const findUser = await this.userRepository.findUserByEmail(email);
    if (!findUser) {
      throw new Error('User or password invalid.');
    }
    const passwordMatch = await compare(password, findUser.password);
    if (!passwordMatch) {
      throw new Error('User or password invalid.');
    }
    let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
    if (!secretKey) {
      throw new Error('There is no token key');
    }
    let secretKeyRefreshToken: string | undefined =
      process.env.ACCESS_KEY_TOKEN_REFRESH;
    if (!secretKeyRefreshToken) {
      throw new Error('There is no token key');
    }
    const token = sign({ email }, secretKey, {
      subject: findUser.id,
      expiresIn: '15m',
    });
    const refreshToken = sign({ email }, secretKeyRefreshToken, {
      subject: findUser.id,
      expiresIn: '7d',
    });
    return {
      token,
      refresh_token: refreshToken,
      user: {
        name: findUser.name,
        email: findUser.email,
        avatar_url: findUser.avatar_url,
      },
    };
  }
  async refresh(refresh_token: string) {
    if (!refresh_token) {
      throw new Error('Refresh token missing');
    }
    let secretKeyRefresh: string | undefined =
      process.env.ACCESS_KEY_TOKEN_REFRESH;
    if (!secretKeyRefresh) {
      throw new Error('There is no refresh token key');
    }
    let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
    if (!secretKey) {
      throw new Error('There is no refresh token key');
    }
    const verifyRefreshToken = verify(refresh_token, secretKeyRefresh);
    const { sub } = verifyRefreshToken;
    const newToken = sign({ sub }, secretKey, {
      expiresIn: '1h',
    });
    const refreshToken = sign({ sub }, secretKeyRefresh, {
      expiresIn: '7d',
    });
    return { token: newToken, refresh_token: refreshToken };
  }
}

export default UsersService;