import { UserController } from '@/controllers/UserController';
import { UserRepository } from '@/repositories/UserRepository';
import { UserService } from '@/services/UserService';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
