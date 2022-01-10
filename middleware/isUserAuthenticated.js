export const isUserAuthenticated = (req, res, next) => {
  req.session.email ? next() : res.redirect("/auth/login");
};
