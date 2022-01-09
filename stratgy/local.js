import passport from "passport";
import PassportLocal from "passport-local";
import { User } from "../models/User.js";

passport.use(
  new PassportLocal.Strategy(async (email, password, done) => {
    const user = await User.findOne({ where: { email } }).catch((err) => {
      done(err);
    });
    if (!user) {
      return done(null, false, { message: "user not registered yet" });
    }

    if (user.getDataValue("password") !== password) {
      return done(null, false, { message: "password incorrect" });
    }

    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.dataValue.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await User.findOne({ where: { email } });

    done(null, user);
  } catch (err) {
    done(err);
  }
});
