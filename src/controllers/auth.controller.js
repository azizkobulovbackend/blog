const { prisma } = require("../utils/database");
const { compare, hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utils/jwt");
const config = require("../../config");
const Joi = require("joi");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const check = Joi.object({
      username: Joi.string().required(),
    });

    const { error } = check.validate({ username });
    if (error) return res.status(400).json({ message: error.message });
    const findUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!findUser) return res.json({ message: "Invalid username or password" });

    const verify = await compare(password, findUser.password);
    if (!verify) return res.json({ message: "Invalid username or password" });

    const token = jwt.sign({ id: findUser.id }, config.jwtSecretKey, {
      expiresIn: "24h",
    });

    res.json({ data: token });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const check = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(5).required(),
    });

    const { error } = check.validate({ username, password });
    if (error) return res.status(400).json({ message: error.message });

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res
        .status(403)
        .json({ message: "You have already registered with this username!" });
    }

    const hashedPass = await hash(password, 12);

    const newUser = await prisma.user.create({
      data: { username, password: hashedPass },
    });

    const token = createToken({
      id: newUser.id,
    });

    res.status(201).json({ message: "Success", data: token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { login, register };
