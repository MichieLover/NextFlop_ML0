import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './presentation/modules/auth.module';
import { UsersModule } from './presentation/modules/users.module';
import { ProfilesModule } from './presentation/modules/profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://mongodb-auth:27017/nextflop_auth?authSource=admin'),
    AuthModule,
    UsersModule,
    ProfilesModule,
  ],
})
export class AppModule {}
