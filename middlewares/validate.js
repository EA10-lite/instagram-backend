
const Joi = require("joi");

module.exports = (schema) => (req, res, next) => {
    const { error } = Joi.object(schema).validate(req.body);
    if(error) return res.status(400).send({ error: error.details[0].message });

    next();
}