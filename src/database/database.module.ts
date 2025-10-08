import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASS ?? 'toor',
      database: process.env.DB_NAME ?? 'sso_db',
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo
    }),
  ],
})
export class DatabaseModule {}
