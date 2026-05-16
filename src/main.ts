import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as os from 'os';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 8080;
  const env = (process.env.ENVIRONMENT || 'development').toLowerCase();

  // Enable compression for better performance
  app.use(compression());

  // CORS Configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['*'];

  app.enableCors({
    origin: env === 'development' || env === 'dev' ? '*' : allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Bind to 0.0.0.0 to allow access from other devices on the network
  await app.listen(port, '0.0.0.0');

  // Get Network IP Address for physical device connectivity
  const networkInterfaces = os.networkInterfaces();
  let localIp = 'localhost';
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    if (interfaces) {
      for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }
    if (localIp !== 'localhost') break;
  }

  logger.log(`==========================================================`);
  logger.log(`🚀 Server is running in ${env.toUpperCase()} mode`);
  logger.log(`📡 Local URL: http://localhost:${port}`);
  logger.log(`🌐 Network URL: http://${localIp}:${port}`);
  logger.log(`==========================================================`);
  logger.log(`📱 MOBILE APP CONNECTIVITY:`);
  logger.log(`👉 iOS Simulator: http://localhost:${port}`);
  logger.log(`👉 Android Emulator: http://10.0.2.2:${port}`);
  logger.log(`👉 Physical Device: http://${localIp}:${port}`);
  logger.log(`   (Ensure device is on the same WiFi network)`);
  logger.log(`==========================================================`);
}
bootstrap();
