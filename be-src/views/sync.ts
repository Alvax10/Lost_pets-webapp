import { Auth } from "../models/Auth";
import { User } from "../models/User";
import { Mascot } from "../models/Mascot";
import { sequelize } from "../models/database";

// (async function() {
//     try {
//         const res = await sequelize.authenticate();
//         console.log("Connection has been established succesfully.");

//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();

// sequelize.sync()
// .then((res) => {
//     console.log(res);
// })
// .catch((err) => {
//     console.log("Este es el error de sync sequelize :", err);
// });

// Auth.sequelize.sync({ force: true })
// .then((res) => {
//     console.log(res);
// })
// .catch((err) => {
//     console.log("Este es el error de sync Auth :", err);
// });

// User.sequelize.sync({ force: true })
// .then((res) => {
//     console.log(res);
// })
// .catch((err) => {
//     console.log("Este es el error de sync User :", err);
// });

// Mascot.sequelize.sync({ force: true })
// .then((res) => {
//     console.log(res);
// })
// .catch((err) => {
//     console.log("Este es el error de sync Mascot :", err);
// });