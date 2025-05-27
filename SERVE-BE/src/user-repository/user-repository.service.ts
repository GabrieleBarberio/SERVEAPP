import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/user-repository/entity/user.entity';
import { CustomException } from 'src/common/exception/custom-exception';
import { CustomExceptionEnum } from 'src/common/enums/custom-exception';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getById(id: number): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new CustomException(CustomExceptionEnum.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new CustomException(CustomExceptionEnum.GENERIC_ERROR);
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new CustomException(CustomExceptionEnum.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new CustomException(CustomExceptionEnum.GENERIC_ERROR);
    }
  }
  async getByUsername(username: string): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        username,
      });

      if (!user) {
        throw new CustomException(CustomExceptionEnum.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      console.error(error);
      throw new CustomException(CustomExceptionEnum.GENERIC_ERROR);
    }
  }

  async getByUsernameEmail(username: string, email: string): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        username,
        email,
      });

      if (!user) {
        throw new CustomException(CustomExceptionEnum.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      console.error(error);
      throw new CustomException(CustomExceptionEnum.GENERIC_ERROR);
    }
  }

  async create(user: User): Promise<User> {
    if (!user || !user.email || !user.username) {
      throw new CustomException(CustomExceptionEnum.GENERIC_ERROR);
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
        throw new CustomException(CustomExceptionEnum.USER_ALREADY_EXISTS);
      }
      user = this.userRepository.create(user);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new CustomException(CustomExceptionEnum.GENERIC_ERROR);
    }
  }
}
