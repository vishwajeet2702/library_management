import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config(); //Load the environment variable
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not in DTO
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  await app.listen(process.env.PORT || 3000);
  console.log(
    `Library-Management System is running on http://localhost:${process.env.PORT || 3000}`,
  );
}
bootstrap();
