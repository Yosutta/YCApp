const baseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                })
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        }
    }
})

const Joi = baseJoi.extend(extension)

exports.campgroundSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    // images: Joi.object({
    //     url: Joi.string().required(),
    //     fileName: Joi.string().required()
    // }).required(),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array()
})

exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
})