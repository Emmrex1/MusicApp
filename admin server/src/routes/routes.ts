import  express   from "express";
import { isAuth } from "../middleware/middleware.js";
import { addAlbum } from "../controller/controller.js";

const router = express.Router();

router.post("/album/new",isAuth, addAlbum);

export default router;