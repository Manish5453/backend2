import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload files on Cloudinary
        await cloudinary.uploader
       .upload(
           localFilePath, {
               resource_type: "auto"
           }
       )
       // file has been uploaded successfully
       console.log("file uploaded on cloudinary successfully",
        response.url);
        return response;
    } catch (error){
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export { uploadOnCloudinary }


