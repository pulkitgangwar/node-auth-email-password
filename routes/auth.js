import { Router } from "express";
const router = Router();

router.get("/login", (req, res) => {
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
    res.send("registered");
    console.log({ name, password, email });
  }
});

export default router;
