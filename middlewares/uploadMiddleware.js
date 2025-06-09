import multer from "multer";



const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage }); // Use this with sharp buffer processing

export default upload;
