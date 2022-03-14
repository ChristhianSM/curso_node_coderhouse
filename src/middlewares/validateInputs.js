import { validationResult } from "express-validator";

export const validateInputs = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors)
    }

    next();
}
