import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: 'postgres',
    username: process.env.USERNAME_POSTGRES,
    password: process.env.PASSWORD_POSTGRES,
    database: process.env.DATABASE_POSTGRES,
    port: 5432,
    host: process.env.HOST_POSTGRES,
    ssl: true,
    // Esto es necesario para que corra correctamente
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
