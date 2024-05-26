import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { CommonData } from './models/user.module';
import { ConfigModule } from '@nestjs/config';
import { ApiToken } from './middleware/api-token';

const appModules = [UserModule, CommonData];
const typeOrmModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Gui101199@',
  database: 'postgres',
  autoLoadEntities: true,
  migrations: ['src/migration/**/*.ts'],
  synchronize: false,
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    typeOrmModule,
    ...appModules,
  ],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiToken)
      .forRoutes(
        { path: 'users/getAllUsers', method: RequestMethod.ALL },
        { path: 'users/addUser', method: RequestMethod.ALL },
        { path: 'users/updateUser', method: RequestMethod.ALL },
        { path: 'users/deleteUser', method: RequestMethod.ALL },
      );
  }
}
