import { User } from "../models/User.js";

export const registerUser = async (user) => {
  const { email, password, name } = user;
  const alreadyRegisteredUser = await User.findOne({ where: { email } });

  if (alreadyRegisteredUser) {
    throw new Error("User Already Exists");
  }

  const registeredUser = User.build({ email, password, name });
  const savedUser = await registeredUser.save();
  return savedUser;
};

export const validateUser = (user) => {
  const { email, password, name } = user;
  let errors = [];

  if (password.length < 6) {
    errors.push("password should be greater than 6 characters");
  }

  return errors;
};
