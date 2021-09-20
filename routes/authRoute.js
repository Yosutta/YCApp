const express = require('express')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const authController = require('../controllers/authController')
const route = express.Router()

route.route('/register')
    .get(authController.renderRegisterForm)
    .post(catchAsync(authController.registerUser))

route.route('/login')
    .get(authController.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), authController.loginUser)

route.get('/logout', authController.logoutUser)

module.exports = route
