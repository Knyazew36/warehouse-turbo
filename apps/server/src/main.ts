import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { AllExceptionsFilter } from './common/fitlers/exception.filter'
import { ValidationPipe } from '@nestjs/common'
import { config } from 'dotenv'
import * as path from 'path'

// Загружаем правильный .env файл в зависимости от NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
config({ path: path.resolve(process.cwd(), envFile) })
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://localhost:5173',
      'https://localhost:5172',
      'http://localhost:5172',
      // 'https://localhost:5173/',
      // 'https://localhost:10004/',
      'https://localhost:10004',
      'https://warehouse-turbo-frontend.vercel.app',
      'https://5278831-ad07030.twc1.net',
      'https://5278831-ad07030.twc1.net/',
      'http://5278831-ad07030.twc1.net',
      process.env.WEBAPP_URL
      // 'https://big-grain-tg.vercel.app',
      // 'https://front-test.devmill.ru'
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-organization-id'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })

  app.setGlobalPrefix('api')

  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER)
  app.useLogger(winstonLogger)
  // app.use(cookieParser());
  //swagger
  // const config = new DocumentBuilder()
  // .setTitle('Bitrix24')
  // .setDescription('The cats API description')
  // .setVersion('1.0')
  // .addTag('bitrix')
  // .build();
  // const documentFactory = () => SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, documentFactory);

  // app.useGlobalInterceptors(new ResponseInterceptor());
  // app.useGlobalInterceptors(new DbStatusInterceptor(app.get('PrismaService')));
  app.useGlobalFilters(new AllExceptionsFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // Удаляет неописанные в DTO поля
      // forbidNonWhitelisted: true, // Ошибка при передаче неописанных полей
      transform: true // Автоматически преобразует входные данные к типу DTO
    })
  )

  const port = process.env.PORT || 4000
  app.listen(port)
}
bootstrap()
