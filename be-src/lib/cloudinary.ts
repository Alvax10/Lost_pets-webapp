import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";

cloudinary.config({ 
    cloud_name: 'dmkh4ftfq', 
    api_key: process.env.API_KEY_CLOUDINARY, 
    api_secret: process.env.API_SECRET_CLOUDINARY, 
});

export { cloudinary };