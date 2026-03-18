import multer from "multer";
import path from "path";

// Avatar storage configuration
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedFilename = file.originalname.replace(/\s+/g, '-');
    cb(null, `${uniqueSuffix}-${sanitizedFilename}`);
  },
});

// Resume storage configuration
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/resume");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedFilename = file.originalname.replace(/\s+/g, '-');
    cb(null, `${uniqueSuffix}-${sanitizedFilename}`);
  },
});


const avatarFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  
  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
    return cb(new Error("Only JPG, JPEG, and PNG image files are allowed"), false);
  }
  cb(null, true);
};

const resumeFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf", 
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  
  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
    return cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
  }
  cb(null, true);
};


export const uploadAvatars = multer({
  storage: avatarStorage,
  limits: { 
    fileSize: 2 * 1024 * 1024, 
    files: 1
  },
  fileFilter: avatarFileFilter,
});

export const uploadResumes = multer({
  storage: resumeStorage,
  limits: { 
    fileSize: 5 * 1024 * 1024, 
    files: 1
  },
  fileFilter: resumeFileFilter,
});