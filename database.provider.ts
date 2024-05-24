import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'Gui101199@',
        database: 'postgres',
        entities: [__dirname + 'src/models/user.model.ts'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
