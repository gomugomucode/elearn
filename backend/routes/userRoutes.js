const express = require("express");
const router = express.Router();
const multer = require("multer");
const { bulkUploadUsers } = require("../controllers/userUploadController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/users/bulk-upload", upload.single("file"), bulkUploadUsers);

module.exports = router;
