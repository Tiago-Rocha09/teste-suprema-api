import { Router } from "express";
import {
  getAllPages,
  createPage,
  updatePage,
  getPageById,
  deletePage,
  getPageContentBySlug,
  selectPages,
} from "../controllers/page.controller";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", getAllPages);
router.get("/select", selectPages);
router.get("/:id", getPageById);
router.get("/content/:slug", getPageContentBySlug);
router.post("/", upload.any(), createPage);
router.put("/:id", upload.any(), updatePage);
router.delete("/:id", deletePage);

export default router;
