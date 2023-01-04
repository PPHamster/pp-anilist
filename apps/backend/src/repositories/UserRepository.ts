import { PrismaService } from '@/services/PrismaService';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  public getAllUser(): Promise<User[]> {
    return this.prismaService.user.findMany({
      orderBy: { name: 'asc' },
    });
  }

  public getUserWhereUnique(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({ where });
  }

  public updateUserWhereUnique(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.prismaService.user.update(args);
  }
}
