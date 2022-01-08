import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./database/config.js";
import AuthRoutes from "./routes/auth.js";
import DashboardRoutes from "./routes/dashboard.js";

// creating app
const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// loading all env variables
dotenv.config();

// view engine handlebars
app.set("view engine", "hbs");

app.use("/auth", AuthRoutes);
app.use("/dashboard", DashboardRoutes);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`server started on port ${process.env.PORT || 3000}`);

  await sequelize.sync();
});
