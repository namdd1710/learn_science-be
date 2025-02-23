import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { _apiCode } from "../errors/errors.js";
import { errorResponse, successResponse } from "../utils/response.js";
import path from "path";
import { getUserIdFromRequest } from "../secure/secure.js";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Multer: lưu vào bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Controller upload ảnh lên Cloudinary
export const adminUploadImage = async (req, res) => {
  const folder = req.body.folder;

  if (!folder) {
    return res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, "Folder is required", null));
  }

  if (!req.files || req.files.length === 0) {
    return res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, "No files uploaded", null));
  }

  try {
    const uploadPromises = req.files.map(async (file) => {
      const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const fileNameWithoutExtension = path.parse(file.originalname).name;
      // const uniqueFileName = `${fileNameWithoutExtension}-${Date.now()}`;
      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "admin/"+folder,
        public_id: fileNameWithoutExtension,
        overwrite: true,
      });
      const imageName = `admin/${folder}/${file.originalname}`;
      return {
        name: file.originalname,
        key: imageName,
        imageUrl:result.secure_url
      };
    });

    const imageUrls = await Promise.all(uploadPromises);
    res.status(_apiCode.SUCCESS).json(successResponse(imageUrls));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const userUploadImage = async (req, res) => {
  const folder = "users";

  if (!req.files || req.files.length === 0) {
    return res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, "No files uploaded", null));
  }

  try {
    const uploadPromises = req.files.map(async (file) => {
      const userId = getUserIdFromRequest(req);
      const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const fileNameWithoutExtension = path.parse(file.originalname).name;
      const uniqueFileName = `${fileNameWithoutExtension}-${userId}`;
      await cloudinary.uploader.upload(fileBase64, {
        folder,
        public_id: uniqueFileName,
        overwrite: true,
      });
      const imageName = `${folder}/${file.originalname}`;
      return {
        imageName,
        key: uniqueFileName,
      };
    });

    const imageUrls = await Promise.all(uploadPromises);
    res.status(_apiCode.SUCCESS).json(successResponse(imageUrls));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  } finally {
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await cloudinary.uploader.destroy(file.filename);
      }
    }
  }
};

export default upload;
