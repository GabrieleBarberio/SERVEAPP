import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/user-repository/entity/user.entity';
import { ServeException } from 'src/common/exception/serve-exception';
import { CustomExceptionEnum } from 'src/common/enums/custom-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { propagateException } from 'src/common/exception/exception-utils';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getById(id: number): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new ServeException(CustomExceptionEnum.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      propagateException(error);
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new ServeException(CustomExceptionEnum.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      propagateException(error);
    }
  }
  async getByUsername(username: string): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        username,
      });

      if (!user) {
        throw new ServeException(CustomExceptionEnum.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      propagateException(error);
    }
  }

  async getByUsernameEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        username,
        email,
      });
      return user;
    } catch (error) {
      propagateException(error);
    }
  }

  async create(user: User): Promise<User> {
    if (!user || !user.email || !user.username) {
      throw new ServeException(CustomExceptionEnum.GENERIC_ERROR);
    }
    try {
      const data = await this.userRepository.findOne({
        where: [
          { id: user.id },
          { email: user.email },
          { username: user.username },
        ],
      });
      if (data) {
        throw new ServeException(CustomExceptionEnum.USER_ALREADY_EXISTS);
      }
      user = this.userRepository.create(user);
      return await this.userRepository.save(user);
    } catch (error) {
      propagateException(error);
    }
  }
}
