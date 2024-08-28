const { Router } = require("express");
const {
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
} = require("../controllers/blog.controller");
const isAuth = require("../middlewares/isAuth");
const router = Router();

const route = "/blog";

router.get(`${route}/`, isAuth, getMyBlogs);
router.post(`${route}/`, isAuth, createBlog),
router.put(`${route}/:id`, isAuth, updateBlog),
router.delete(`${route}/:id`, isAuth, deleteBlog),
router.post(`${route}/:blogId`, isAuth, joinBlog),
router.post(`${route}/leave/:blogId`, isAuth, leaveBlog),
router.get(`${route}/my-joined-blogs`, isAuth, getMyJoinedBlogs);
router.get(`${route}/:id`, isAuth, getBlogInfo);
router.get(`${route}/users/:id`, isAuth, getUsers);
router.post(`${route}/search/:text`, isAuth, searchBlog);

module.exports = router;
