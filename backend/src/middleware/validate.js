import { validationResult } from 'express-validator'

/**
 * Runs express-validator checks and returns 422 with all errors if any fail
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }))
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    })
  }
  next()
}
