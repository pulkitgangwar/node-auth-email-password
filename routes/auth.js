import { Router } from "express";
import passport from "passport";
import { registerUser, validateUser } from "../helpers/helper.js";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
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


  const session = Session.build({ userId: registeredUser.getDataValue("id") });
  const savedSession = await session.save();

  res.cookie("auth", savedSession.getDataValue("id"), {
    maxAge: 86400,
    httpOnly: true,
    signed: true,
  });

  res.redirect("/dashboard");
});

router.get("/logout", async (req, res) => {
  // req.session.destroy();
  const session = await Session.findOne({
    where: { id: req.signedCookies.auth },
  });
  await session.destroy();
  res.clearCookie("auth", {
    httpOnly: true,
    signed: true,
  });

  res.redirect("/auth/login");
});

export default router;
