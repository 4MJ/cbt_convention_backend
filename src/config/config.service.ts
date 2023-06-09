import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

require('dotenv').config();

class ConfigService {

    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public isProduction() {
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            // type: 'postgres',
            // host: this.getValue('POSTGRES_HOST'),
            // port: parseInt(this.getValue('POSTGRES_PORT')),
            // username: this.getValue('POSTGRES_USER'),
            // password: this.getValue('POSTGRES_PASSWORD'),
            // database: this.getValue('POSTGRES_DATABASE'),

            type:'mysql',
            host: this.getValue('DATABASE_HOST'),
            port: parseInt(this.getValue('DATABASE_PORT')),
            username: this.getValue('DATABASE_USERNAME'),
            password: this.getValue('DATABASE_PASSWORD'),
            database:this.getValue('MYSQL_DATABASE'),
            entities: [User],
            migrationsTableName: 'migration',
            migrations: ['src/migration/*.ts'],
            synchronize:true,
            //   cli: {
            //     migrationsDir: 'src/migration',
            //   },

            ssl: this.isProduction(),
        };
    }

}

const configService = new ConfigService(process.env)
    .ensureValues([
        // 'POSTGRES_HOST',
        // 'POSTGRES_PORT',
        // 'POSTGRES_USER',
        // 'POSTGRES_PASSWORD',
        // 'POSTGRES_DATABASE'
        'DATABASE_TYPE',
        'DATABASE_HOST',
        'DATABASE_PORT',
        'DATABASE_USERNAME',
        'DATABASE_PASSWORD',
        'MYSQL_DATABASE',
    ]);

export { configService };