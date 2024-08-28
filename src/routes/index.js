const authRoute = require('./auth.route')
const blogRoute = require('./blog.route')
const postRoute = require('./post.route')
const commentsRoute = require('./comments.route')

module.exports = [authRoute, blogRoute, postRoute, commentsRoute]