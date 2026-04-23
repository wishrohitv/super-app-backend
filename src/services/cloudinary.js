import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  secure: true,
});

const uploadFiles = async (files) => {
  try {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error);
    throw error;
  }
};
