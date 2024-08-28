const { prisma } = require("../utils/database");
const { compare, hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utils/jwt");
const config = require("../../config");
const Joi = require("joi");

const getPostsByBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogs = await prisma.blog.findUnique({
      where: {
        id,
      },
      include: {
        posts: true,
      },
    });

    await res.json({ data: blogs });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, description, blogId } = req.body;

    const newPost = { title, description, blogId, authorId: req.user.id };
    const data = await prisma.post.create({ data: newPost });
    await res.json({ message: "Created", data: data });
  } catch (error) {
    console.log(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) return res.json({ message: "No post with this id" });
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        views: views + 1,
      },
    });
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

const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findPost = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: true,
      },
    });
    if (!findPost) return res.json({ message: "No post with this id" });
    await res.json({ data: findPost });
  } catch (error) {
    console.log(error);
  }
};

const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const findPost = await prisma.post.findUnique({
    where: {
      id,
      authorId: req.user.id,
    },
  });
  if (!findPost) return res.json({ message: "Post not found" });
  await prisma.post.update({ where: { id }, data: { title, description } });
  await res.json({ message: "Post updated" });
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const findPost = await prisma.post.findUnique({
    where: {
      id,
      authorId: req.user.id,
    },
  });
  if (!findPost) return res.json({ message: "Post not found" });
  await prisma.post.delete({ where: { id } });
  await res.json({ message: "Post deleted" });
};

const sortPosts = async (req, res) => {
  const { id } = req.params;
  const posts = await prisma.blog.findMany({
    where: { id },
    include: {
      posts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  await res.json({ data: posts });
};

module.exports = {
  createPost,
  getPostsByBlog,
  getPostById,
  updatePost,
  deletePost,
  sortPosts,
  getComments,
};
