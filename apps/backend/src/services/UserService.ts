import { UserRepository } from '@/repositories/UserRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}

  public getAllUser(): Promise<User[]> {
    return this.userRepository.getAllUser();
  }

  public async getUserByEmailOrThrow(email: string): Promise<User> {
    const user = await this.userRepository.getUserWhereUnique({ email });
    if (!user) throw new BadRequestException("Don't have user from this email");
    return user;
  }

  public async getUserByIdOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.getUserWhereUnique({ id });
    if (!user) throw new BadRequestException("Don't have user from this id");
    return user;
  }
}
