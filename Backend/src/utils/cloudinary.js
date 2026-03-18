import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs"
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath,folder = "uploads") => {
    try {
        if(!localFilePath) return null;

        const isDocument = /\.(pdf|doc|docx)$/i.test(localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath,{
            folder: folder,
            resource_type: isDocument ? "raw" : "auto",
            access_mode: "public", 
            type: "upload", 
        })
        
        fs.unlinkSync(localFilePath) 
        return response;
        
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        }
        return null;
    }
}


export default uploadOnCloudinary;
