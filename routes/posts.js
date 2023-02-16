const router = require('express').Router()
const controller = require('../controllers/postController')
const { checkAuth, checkAdminPrivileges } = require("../passport-config");

router.get('/create_post', checkAuth, controller.post_create_get)

router.post('/create_post', checkAuth, controller.post_create_post)

router.get('/:message_id/delete', checkAdminPrivileges, controller.post_delete_get)

router.post('/:message_id/delete', checkAdminPrivileges, controller.post_delete_post)

module.exports = router