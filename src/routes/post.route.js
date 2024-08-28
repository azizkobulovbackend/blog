const {Router} = require('express')
const { createPost, getPostsByBlog, getPostById, updatePost, deletePost, sortPosts, getComments } = require('../controllers/post.controller')
const isAdmin = require('../middlewares/isAdmin')
const isAuth = require('../middlewares/isAuth')
const router = Router()

const route = '/post'

router.get(`${route}/:id`, isAuth, getPostsByBlog)
router.get(`${route}/views/:postId`, isAuth, getPostById)
router.get(`${route}/comments/:id`, isAuth, getComments)
router.post(`${route}/`,isAuth, createPost),
router.post(`${route}/sort/:id`,isAuth, sortPosts),
router.put(`${route}/:id`, isAuth, updatePost),
router.delete(`${route}/:id`,isAuth, deletePost),

module.exports = router