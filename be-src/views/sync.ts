import { Auth } from "../models/Auth";
import { User } from "../models/User";
import { Mascot } from "../models/Mascot";

Auth.sequelize.sync({ force: true })
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});

User.sequelize.sync({ force: true })
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});

Mascot.sequelize.sync({ force: true })
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});