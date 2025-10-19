import express from 'express'
import commentController from '../controllers/comment.controller.js'
import AuthMiddleware from '../middlewares/auth.middleware.js';

const CommentRoutes = express.Router()

CommentRoutes.get('/', commentController.getComments);
CommentRoutes.post('/', AuthMiddleware(), commentController.createComment);
CommentRoutes.patch('/:id', commentController.hideComment);

export default CommentRoutes