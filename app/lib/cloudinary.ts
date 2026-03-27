import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  logger.warn("Cloudinary configuration is missing!");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

