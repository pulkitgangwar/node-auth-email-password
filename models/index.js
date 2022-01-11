import { Session } from "./Session.js";
import { User } from "./User.js";

User.hasMany(Session, { foreignKey: "userId" });
