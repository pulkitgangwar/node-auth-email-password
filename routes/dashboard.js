import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  console.log(req.user);
  res.render("dashboard");

});

export default router;
