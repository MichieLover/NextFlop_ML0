import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { MediaModule } from "./presentation/modules/media.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://mongodb-media:27017/nextflop_media"),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_jwt_secret_key",
      signOptions: { expiresIn: "24h" },
    }),
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
