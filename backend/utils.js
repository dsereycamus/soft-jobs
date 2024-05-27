const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JSON_SECRET = process.env.JSON_SECRET || "secreto";
const saltRounds = 10;

const jwtUtils = {
  signUser: (user) => {
    return jwt.sign(user, JSON_SECRET);
  },
  decodeUser: (token) => {
    return jwt.verify(token, JSON_SECRET);
  },
};

const cryptUtils = {
  checkPassword: async (encryptedPassword, password) => {
    return await bcrypt.compare(password, encryptedPassword);
  },
  encryptPassword: async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  },
};

const checkRoutes = (currRoute, routes) => {
  if (routes.includes(currRoute)) return true;
  return false;
};

module.exports = { jwtUtils, checkRoutes, cryptUtils };
