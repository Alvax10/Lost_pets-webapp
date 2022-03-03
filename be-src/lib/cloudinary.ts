import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";

cloudinary.config({ 
    cloud_name: 'dx1fmmltu', 
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY,
});

console.log({
    API_KEY_CLOUDINARY: process.env.API_KEY_CLOUDINARY,
    API_SECRET_CLOUDINARY: process.env.API_SECRET_CLOUDINARY,
})

export { cloudinary };