import { v2 as cloudinary } from 'cloudinary';
import  dotenv from "dotenv";

dotenv.config({ path : 'backend/config/config.env'})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = async (file, folder) => {
    try {
        // cloudinary.uploader.upload() can take a Base64 string directly
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: "auto" // This helps Cloudinary identify it's an image
        });

        return {
            public_id: result.public_id,
            url: result.secure_url,
        };
    } catch (error) {
        // This is likely where the error is being thrown
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

export const delete_file = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      public_id,
      (result) => {
        resolve(result);
      }
    );
  });
};
 


export default cloudinary;
