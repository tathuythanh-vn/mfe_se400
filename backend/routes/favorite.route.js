import express from 'express';
import favoriteController from '../controllers/favorite.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const FavoriteRoutes = express.Router();

// Toggle yêu thích (like/unlike)
FavoriteRoutes.post('/', AuthMiddleware(), favoriteController.toggleFavorite);

// Kiểm tra đã yêu thích hay chưa
FavoriteRoutes.get('/', AuthMiddleware(), favoriteController.checkFavoriteStatus);

export default FavoriteRoutes;
