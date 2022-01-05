import { Auth } from "../models/Auth";
import { User } from "../models/User";
import { Mascot } from "../models/Mascot";

Auth.sequelize.sync({ alter: true })
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});

User.sequelize.sync({ alter: true })
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});

Mascot.sequelize.sync({ alter: true })
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});