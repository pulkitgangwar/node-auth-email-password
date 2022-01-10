import { isUserAuthenticated } from "./isUserAuthenticated.js";

export const isAdmin = (req, res, next) => {
  isUserAuthenticated && req.session.isAdmin
    ? next()
    : res.redirect("/dashboard");
};
