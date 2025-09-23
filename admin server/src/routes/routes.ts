import  express   from "express";

import { addAlbum } from "../controller/controller.js";
import { isAuth } from "../middleware/middleware.js";
import uploadFiles from "../config/multer.js";

const router = express.Router();

router.post("/album/new",isAuth, uploadFiles, addAlbum);


export default router;