import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.js';


const fileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'QLDV/files',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

const uploadFile = multer({ storage: fileStorage });

export default uploadFile;
