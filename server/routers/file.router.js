const Router = require("express");
const File = require("../models/File");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const fileController = require("../controllers/file.controller");

router.post("", authMiddleware, fileController.createDir);
router.get("", authMiddleware, fileController.getFiles);

module.exports = router;
