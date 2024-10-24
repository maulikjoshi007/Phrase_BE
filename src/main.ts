import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with environment-based origin setup
  app.enableCors({
    allowedHeaders: '*',
    origin: process.env['CORS'] ? process.env['CORS'].split(',') : '*', // Splits the CORS env var into an array or uses '*' as default
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
