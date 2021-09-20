const express = require('express')
const route = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const reviewsController = require('../controllers/reviewsController')
const { validateReview, isLoggedin, isReviewOwner } = require('../middleware')

route.post('/', validateReview, isLoggedin, catchAsync(reviewsController.createReview))

route.delete('/:reviewId', isLoggedin, isReviewOwner, catchAsync(reviewsController.deleteReview))

module.exports = route