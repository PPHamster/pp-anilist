import { UserRepository } from '@/repositories/UserRepository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}

  public getAllUser(): Promise<User[]> {
    return this.userRepository.getAllUser();
  }

  public getUserByEmail(email: string): Promise<User> {
    return this.userRepository.getUserWhereUnique({ email });
  }

  public getUserById(id: string): Promise<User> {
    return this.userRepository.getUserWhereUnique({ id });
  }
}
