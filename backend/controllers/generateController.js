const { streamGeneratedContent } = require("../services/openRouterService");
const { AppError } = require("../utils/AppError");

const generateContent = async (req, res, next) => {
  const { text, type } = req.validatedBody;

  try {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    await streamGeneratedContent({
      text,
      type,
      onChunk: (chunk) => {
        res.write(chunk);
      }
    });
    res.end();
  } catch (error) {
    if (res.headersSent) {
      res.write(
        `\n\n[Error] ${error.message || "Generation failed unexpectedly. Please retry."}`
      );
      res.end();
      return;
    }

    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Failed to generate content", 500));
  }
};

module.exports = { generateContent };
