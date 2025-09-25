import multer from "multer";
import { Request } from "express";
import { AppError } from "../errors/AppError.error";

// Configuração simplificada e eficiente
export const upload = multer({
  storage: multer.memoryStorage(), // Arquivos em memória como buffers
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB em notação mais legível
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Tipo de arquivo não permitido. Use PDF, DOCX ou XLSX",
          400
        )
      );
    }
  },
});

// REMOVER: A criação do diretório de uploads não é mais necessária
// pois os arquivos não serão salvos localmente

// import multer from "multer";
// import path from "path";
// import { Request } from "express";
// import { AppError } from "../errors/AppError.error";

// // Configuração do storage
// const storage = multer.diskStorage({
//   destination: (req: Request, file: Express.Multer.File, cb) => {
//     const uploadPath = path.join(__dirname, "..", "..", "uploads", "templates");
//     cb(null, uploadPath);
//   },
//   filename: (req: Request, file: Express.Multer.File, cb) => {
//     // Nome único para evitar sobrescrita
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const extension = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + extension);
//   },
// });

// // Filtro de validação de arquivos
// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   const allowedMimeTypes = [
//     "application/pdf",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new AppError("Tipo de arquivo não permitido. Use PDF, DOCX ou XLSX", 400)
//     );
//   }
// };

// // Configuração do Multer
// export const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 10485760, // 10MB - RN01
//   },
// });

// // Criar diretório de uploads se não existir
// import fs from "fs";
// const uploadsDir = path.join(__dirname, "..", "..", "uploads", "templates");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }
