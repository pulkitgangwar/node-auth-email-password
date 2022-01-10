import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import { sequelize } from "./database/config.js";
import AuthRoutes from "./routes/auth.js";
import DashboardRoutes from "./routes/dashboard.js";
import { isUserAuthenticated } from "./middleware/isUserAuthenticated.js";
// stratgy local
import "./stratgy/local.js";

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
    cookie: {
      maxAge: 60000,
    },
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", AuthRoutes);
app.use("/dashboard", isUserAuthenticated, DashboardRoutes);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`server started on port ${process.env.PORT || 3000}`);

  await sequelize.sync();
});
