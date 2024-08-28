const { prisma } = require("../utils/database");
const { compare, hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utils/jwt");
const config = require("../../config");
const Joi = require("joi");

const getMyBlogs = async (req, res, next) => {
  try {
    const id = req.user.id;
    const blogs = await prisma.blog.findMany({
      where: {
        authorId: id,
      },
      include: {
        author: true,
      },
    });

    await res.json({ data: blogs });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const check = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    });

    const { error } = check.validate({ title, description });
    if (error) return res.status(400).json({ message: error.message });

    const newBlog = { title, description, authorId: req.user.id };
    const data = await prisma.blog.create({ data: newBlog });
    await res.json({ data: data });
  } catch (error) {
    console.log(error);
  }
};

const joinBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const findUserBlog = await prisma.userBlog.findUnique({
      where: {
        blogId,
      },
    });
    if (findUserBlog)
      return res.json({ message: "You have already joined this blog" });
    const newUserBlog = { userId: req.user.id, blogId };
    await prisma.userBlog.create({
      data: newUserBlog,
    });
    await res.json({ message: "Joined" });
    console.log(newUserBlog);
  } catch (error) {
    console.log(error);
  }
};

const leaveBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const findBlog = await prisma.userBlog.findUnique({
      where: {
        blogId,
        userId: req.user.id,
      },
    });
    if (!findBlog)
      return res.json({ message: "You havent joined this blog before!" });

    await prisma.userBlog.delete({
      where: {
        userId: req.user.id,
        blogId,
      },
    });
    return res.json({ message: "You have leaved this blog" });
  } catch (error) {
    console.log(error);
  }
};

const getMyJoinedBlogs = async (req, res, next) => {
  try {
    const id = req.user.id;
    const blogs = await prisma.userBlog.findMany({
      where: {
        userId: id,
      },
      include: {
        blog: true,
      },
    });

    await res.json({ data: blogs });
  } catch (error) {
    next(error);
  }
};

const getBlogInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findBlog = await prisma.blog.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
    if (!findBlog) return res.json({ message: "No blog with this id" });
    await res.json({ data: findBlog });
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findBlog = await prisma.blog.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
    if (!findBlog) return res.json({ message: "No blog with this id" });
    const users = await prisma.userBlog.findMany({
      where: {
        blogId: id,
      },
    });
    await res.json({ data: users });
  } catch (error) {
    console.log(error);
  }
};

const updateBlog = async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const findBlog = await prisma.blog.findUnique({
    where: {
      id,
      authorId: req.user.id,
    },
  });
  if (!findBlog) return res.json({ message: "Blog not found" });
  await prisma.blog.update({ where: { id }, data: { title, description } });
  await res.json({ message: "Blog updated" });
};

const deleteBlog = async (req, res, next) => {
  const { id } = req.params;
  const findBlog = await prisma.blog.findUnique({
    where: {
      id,
      authorId: req.user.id,
    },
  });
  if (!findBlog) return res.json({ message: "Blog not found" });
  await prisma.blog.delete({ where: { id } });
  await res.json({ message: "Blog deleted" });
};

const searchBlog = async (req, res, next) => {
  const { text } = req.params;
  const result = await prisma.blog.findMany({
    where: {
      OR: [
        {
          title: {
            contains: text,
            mode: "insensitive", // Case-insensitive search
          },
        },
        {
          description: {
            contains: text,
            mode: "insensitive", // Case-insensitive search
          },
        },
      ],
    },
  });
  if (!result) return res.json({ message: "No blog with this text" });
  await res.json({ data: result });
};

module.exports = {
  createBlog,
  getMyBlogs,
  joinBlog,
  getMyJoinedBlogs,
  getBlogInfo,
  getUsers,
  leaveBlog,
  updateBlog,
  deleteBlog,
  searchBlog,
};
