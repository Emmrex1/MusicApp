import  express   from "express";

import { addAlbum, addsong, addthumbnail, deleteAlbum, deletesong } from "../controller/controller.js";
import { isAuth } from "../middleware/middleware.js";
import uploadFiles from "../config/multer.js";

const router = express.Router();

router.post("/album/new",isAuth, uploadFiles, addAlbum);
router.post("/song/new",isAuth, uploadFiles, addsong);
router.post("/song/:id",isAuth, uploadFiles, addthumbnail);
router.delete("/album/:id",isAuth, deleteAlbum);
router.delete("/song/:id",isAuth, deletesong);



export default router;