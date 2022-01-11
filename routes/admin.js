import { Router } from "express";
import { User } from "../models/User.js";
const router = Router();

router.get("/", (req, res) => {
  res.render("admin/dashboard");
});

router.get("/users", async (req, res) => {
  const users = await User.findAll();
   
  const newUsers = users.map((user) => ({
    email: user.getDataValue("email"),
    name: user.getDataValue("name"),
    isAdmin: user.getDataValue("isAdmin"),
  }));
  res.render("admin/users", {
    users: newUsers,
  });
});

export default router;
