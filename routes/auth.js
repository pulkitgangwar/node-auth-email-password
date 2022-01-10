import { Router } from "express";
import passport from "passport";
import { registerUser, validateUser } from "../helpers/helper.js";
import { User } from "../models/User.js";
const router = Router();

router.get("/login", async (req, res) => {
  const user = await User.findOne({ where: { email: "pulkit@gmail.com" } });

  res.render("login", {
    email: "",
    errors: [],
  });
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

router.post("/login", async (req, res) => {
  /*
    user exists in database or not 
    user password matches or not
    add userid to session
  */
  const { email, password } = req.body;
  const errors = validateUser({ email, password, name: null });
  if (errors.length) {
    return res.render("login", {
      email,
      errors,
    });
  }

  const registeredUser = await User.findOne({ where: { email } });

  if (!registeredUser) {
    return res.render("login", {
      email,
      errors: ["User not registered please register"],
    });
  }

  if (registeredUser.getDataValue("password") !== password) {
    return res.render("login", {
      email,
      errors: ["incorrect user credentials"],
    });
  }

  req.session.email = registeredUser.getDataValue("email");
  req.session.isAdmin = registeredUser.getDataValue("isAdmin");

  res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

export default router;
