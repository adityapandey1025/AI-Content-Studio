const { z } = require("zod");
const { CONTENT_TYPES } = require("../config/constants");
const { AppError } = require("../utils/AppError");

const generateSchema = z.object({
  text: z
    .string({
      required_error: "text is required"
    })
    .trim()
    .min(3, "text must be at least 3 characters")
    .max(5000, "text must be at most 5000 characters"),
  type: z.enum(CONTENT_TYPES, {
    required_error: "type is required",
    invalid_type_error: `type must be one of: ${CONTENT_TYPES.join(", ")}`
  })
});

const validateGenerateRequest = (req, _res, next) => {
  const result = generateSchema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));
    return next(new AppError("Validation failed", 400, details));
  }

  req.validatedBody = result.data;
  return next();
};

module.exports = { validateGenerateRequest };

