import { AuthController } from '@/controllers/AuthController';
import { UserRepository } from '@/repositories/UserRepository';
import { AuthService } from '@/services/AuthService';
import { GoogleStrategy } from '@/utils/strategy/GoogleStrategy';
import { SessionSerializer } from '@/utils/Serializer';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    SessionSerializer,
    UserRepository,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
