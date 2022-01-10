import { Router } from "express";
import passport from "passport";
import { registerUser, validateUser } from "../helpers/helper.js";
import { User } from "../models/User.js";
const router = Router();

router.get("/login", async (req, res) => {
  const user = await User.findOne({ where: { email: "pulkit@gmail.com" } });

  console.log(user.getDataValue("password"));
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register", {
    name: "",
    email: "",
    password: "",
    errors: [],
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const errors = validateUser({ email, password, name });

  if (errors.length) {
    res.render("register", {
      name,
      password,
      email,
      errors,
    });
  } else {
    const user = await registerUser({ email, password, name }).catch((err) => {
      return res.render("register", {
        name,
        email,
        password,
        errors: [err.message],
      });
    });

    if (!user) {
      return;
    }
    res.redirect("login");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/register",
  })
);

export default router;
