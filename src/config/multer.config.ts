import multer from "multer";
import path from "path";
import { Request } from "express";
import { AppError } from "../errors/AppError.error";
import fs from "fs";

const uploadPath = path.join(__dirname, "..", "..", "uploads", "templates");

// Cria a pasta se não existir
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage =
  process.env.NODE_ENV === "development"
    ? multer.diskStorage({
        destination: uploadPath,
        filename: (req: Request, file: Express.Multer.File, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const extension = path.extname(file.originalname);
          cb(null, file.fieldname + "-" + uniqueSuffix + extension);
        },
      })
    : multer.memoryStorage(); // em produção (Supabase)

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError("Tipo de arquivo não permitido. Use PDF, DOCX ou XLSX", 400)
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
