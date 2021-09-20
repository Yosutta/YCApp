const express = require('express')
const route = express.Router()
const flash = require('connect-flash')
const catchAsync = require('../utils/catchAsync')
const campgroundController = require('../controllers/campgroundsController')
const { isLoggedin, validateCampground, isOwner } = require('../middleware')
const { cloudinary, storage } = require('../cloudinary/index')
const multer = require('multer')
const upload = multer({ storage })

route.use(flash())

route.route('/')
    .get(catchAsync(campgroundController.main))
    .post(isLoggedin, upload.array('image'), validateCampground, catchAsync(campgroundController.createCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.files)
//     res.send('Showing image')
// })

route.get('/new', isLoggedin, campgroundController.renderNewForm)

route.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedin, isOwner, upload.array('image'), validateCampground, catchAsync(campgroundController.editCampground))
    .delete(isLoggedin, isOwner, catchAsync(campgroundController.deleteCampground))

route.get('/:id/edit', isLoggedin, isOwner, catchAsync(campgroundController.renderEditForm))

module.exports = route