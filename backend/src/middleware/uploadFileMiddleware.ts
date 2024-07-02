import { Request } from "express";
import multer, { diskStorage, FileFilterCallback } from "multer";
// import path from "path";
import { fileURLToPath } from "url";
import { dirname, extname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, "../../../src/public/profile-pics"));
  },
  filename: (req, file, cb) => {
    const fileName = crypto.randomUUID();
    const extension = extname(file.originalname);
    cb(null, `${fileName}${extension}`);
  },
});

async function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  const fileExtension = extname(file.originalname).toLowerCase();
  const allowedExtensions = [".png", ".jpg", ".jpeg"];

  const isImage = file.mimetype.startsWith("image/");
  const isAllowedExtension = allowedExtensions.includes(fileExtension);

  if (!isImage || !isAllowedExtension) {
    cb(
      new Error(
        "Invalid file type. Only image files (PNG, JPG, JPEG, GIF, and WebP) are allowed."
      )
    );
  }

  cb(null, true);
}

const limits = {
  fileSize: 1 * 1000 * 1000, // 1 MB
  files: 1,
};

const upload = multer({ storage, limits, fileFilter });

export default upload;
