import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "postgres",
    username: "tavydsmiqgioow",
    password: "1d844e99f7431ddafcd8abf470eae01ae61a0dfa88b9f05b695b8881f9ad30ad",
    database: "d498fftp938i0r",
    port: 5432,
    host: "ec2-52-4-100-65.compute-1.amazonaws.com",
    ssl: true,
    // Esto es necesario para que corra correctamente
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
