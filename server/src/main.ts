import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Sequelize } from 'sequelize';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Allow requests from the client
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log('Server listening on port', port);
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
