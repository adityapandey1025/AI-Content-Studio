const express = require("express");
const { generateContent } = require("../controllers/generateController");
const { validateGenerateRequest } = require("../middleware/validateRequest");

const router = express.Router();

router.post("/generate", validateGenerateRequest, generateContent);

module.exports = router;

