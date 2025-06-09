import streamifier from "streamifier";  // Required if using memoryStorage
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

async function uploadAndResizeImage(imageFile, imageFolder) {
    const resizedBuffer = await sharp(imageFile.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: imageFolder },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(resizedBuffer);
    const imageUrl = result.secure_url;
    return imageUrl;
  }

  export default uploadAndResizeImage