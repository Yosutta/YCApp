const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')
const { campgroundSchema, reviewSchema } = require('./schemas.js')

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(400, msg)
    }
    else {
        next()
    }
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params
    const foundCampground = await Campground.findById(id)
    if (!foundCampground.owner._id.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to edit this campground!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params
    const foundReview = await Review.findById(reviewId)
    if (!foundReview.owner._id.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to edit this review!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(400, msg)
    }
    else {
        next()
    }
}