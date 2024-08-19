import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Ara Research')
    .setDescription(
      'Micro Lending Company Accounts Receivable Management System',
    )
    .setVersion('1.0')
    .addGlobalParameters({
      in: 'header',
      required: true,
      name: 'platform',
      schema: {
        example: 'ara-client-app',
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
