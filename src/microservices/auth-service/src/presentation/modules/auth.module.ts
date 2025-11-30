import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../../users/users.module";

// Controllers
import { AuthController } from "../controllers/auth.controller";
import { OnboardingController } from "../controllers/onboarding.controller";

// Use Cases
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case";
import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case";

// Factories and Services
import { UserFactory } from "../../application/factories/user.factory";
import { EventPublisher } from "../../application/services/event-publisher.service";
import { AuthService } from "../../auth/auth.service";

// Infrastructure
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { UserDocument, UserSchema } from "../../infrastructure/database/schemas/user.schema";

// Interfaces
import { USER_REPOSITORY } from "../../domain/repositories/user.repository.interface";

// Guards and Strategies
import { JwtStrategy } from "../guards/jwt.strategy";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    }),
  ],
  controllers: [AuthController, OnboardingController],
  providers: [
    // Use Cases
    LoginUseCase,
    RegisterUseCase,

    // Factories
    UserFactory,

    // Services
    EventPublisher,
    AuthService,

    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },

    // Guards and Strategies
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
