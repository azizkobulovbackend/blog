const { Router } = require("express");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments.controller");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");
const router = Router();

const route = "/comment";

// router.get(`${route}/:id`, isAuth, getPostsByBlog)
// router.get(`${route}/views/:postId`, isAuth, getPostById)
// router.get(`${route}/comments/:id`, isAuth, getComments)
router.post(`${route}/:id`, isAuth, createComment),
  // router.post(`${route}/sort/:id`,isAuth, sortPosts),
router.put(`${route}/:id`, isAuth, updateComment),
router.delete(`${route}/:id`, isAuth, deleteComment),

module.exports = router;
