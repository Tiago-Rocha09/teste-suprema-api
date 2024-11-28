"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const page_controller_1 = require("../controllers/page.controller");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
router.get("/", page_controller_1.getAllPages);
router.get("/:id", page_controller_1.getPageById);
router.post("/", upload_1.default.any(), page_controller_1.createPage);
router.put("/:id", upload_1.default.any(), page_controller_1.updatePage);
router.delete("/:id", page_controller_1.deletePage);
exports.default = router;
