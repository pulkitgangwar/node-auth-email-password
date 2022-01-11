import { Session } from "../models/Session.js";
import { User } from "../models/User.js";

export const isUserAuthenticated = async (req, res, next) => {
  // cookie exists
  if (!req.signedCookies.auth) return res.redirect("/auth/login");

  const session = await Session.findOne({
    where: { id: req.signedCookies.auth },
  });
  const user = await User.findOne({
    where: { id: session.getDataValue("userId") },
  });
  if (!session) {
    res.clearCookie("auth", {
      httpOnly: true,
      signed: true,
    });
    return res.redirect("/auth/login");
  }

  req.user = {
    id: user.getDataValue("id"),
    isAdmin: user.getDataValue("isAdmin"),
    email: user.getDataValue("email"),
  };

  next();
};
