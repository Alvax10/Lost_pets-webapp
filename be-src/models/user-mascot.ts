import { User } from "./User";
import { Mascot } from "./Mascot";

User.hasMany(Mascot);
Mascot.hasMany(User);

export { User, Mascot };
