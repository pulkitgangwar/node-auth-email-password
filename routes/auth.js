import { Router } from "express";
import passport from "passport";
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
  let errors = [];

  if (password.length < 6) {
    errors.push("password should be greater than 6 characters");
  }

  if (errors.length) {
    res.render("register", {
      name,
      password,
      email,
      errors,
    });
  } else {
    const userAlreadyExists = await User.findOne({ where: { email } }).catch(
      (err) => {
        errors.push(err.message);
        res.render("register", {
          name,
          email,
          password,
          errors: [],
        });
      }
    );
    if (userAlreadyExists) {
      errors.push("User already exists");
      res.render("register", {
        name,
        password,
        email,
        errors,
      });
      return;
    }

    const user = User.build({ name, email, password });
    await user.save();
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
