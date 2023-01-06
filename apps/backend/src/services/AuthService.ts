import { UserRepository } from '@/repositories/UserRepository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  public constructor(private readonly userRepository: UserRepository) {}

  public async validateUser(detail: User) {
    const user = await this.userRepository.getUserWhereUnique({
      email: detail.email,
    });
    if (user) {
      if (this.checkSameUserInformation(detail, user)) return user;
      else {
        const userUpdate = await this.userRepository.updateUserWhereUnique({
          where: { email: user.email },
          data: detail,
        });
        return userUpdate;
      }
    }
    const newUser = await this.userRepository.createUser(detail);
    return newUser;
  }

  public getUserById(id: string): Promise<User | null> {
    return this.userRepository.getUserWhereUnique({ id });
  }

  private checkSameUserInformation(client: User, db: User): boolean {
    return (
      client.email === db.email &&
      client.id === db.id &&
      client.image === db.image &&
      client.name === db.name
    );
  }
}
