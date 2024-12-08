import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(helmet());

  app.enableCors({
    origin: '*',
  });

  const appService = app.get(AppModule);
  await appService.seed();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
