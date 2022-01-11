
export const isAdmin = (req, res, next) => {
  req.user.isAdmin ? next() : res.redirect("/dashboard");
};
