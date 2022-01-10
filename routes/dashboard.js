import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  console.log(req.session);
  res.render("dashboard");

});

export default router;
