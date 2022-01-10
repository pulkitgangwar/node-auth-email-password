import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import { sequelize } from "./database/config.js";
import AuthRoutes from "./routes/auth.js";
import DashboardRoutes from "./routes/dashboard.js";
import AdminRoutes from "./routes/admin.js";
import { isUserAuthenticated } from "./middleware/isUserAuthenticated.js";
// stratgy local
import "./stratgy/local.js";
import { isAdmin } from "./middleware/isAdmin.js";

// creating app
const app = express();

// morgan
app.use(morgan("dev"));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// loading all env variables
dotenv.config();

// view engine handlebars
app.set("view engine", "hbs");

// session
app.use(  
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,  
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", AuthRoutes);
app.use("/dashboard", isUserAuthenticated, DashboardRoutes);
app.use("/admin", isAdmin, AdminRoutes);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`server started on port ${process.env.PORT || 3000}`);

  await sequelize.sync();
});
