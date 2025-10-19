// utils/multerImage.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.js';


const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'QLDV/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    resource_type: 'image',
  },
});

const uploadImage = multer({ storage: imageStorage });

export default uploadImage;
