const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.main = async (req, res) => {
    const data = await Campground.find({})
    const campgrounds = data.reverse()
    res.render('campgrounds/home', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    return res.render('campgrounds/newCampground')
}

module.exports.showCampground = async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        model: 'Review',
        populate: 'owner'
    }).populate({ path: 'owner', model: 'User' })
    if (!foundCampground) {
        // throw new ExpressError(404, 'Campground not found')
        req.flash('error', 'Campground not found!')
        res.redirect('/campgrounds')
    }
    else
        res.render('campgrounds/details', { campground: foundCampground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const foundCampground = await Campground.findById(id)
    if (!foundCampground) {
        // throw new ExpressError(404, 'Campground not found')
        req.flash('error', 'Can not edit a campground that is unavailable!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground: foundCampground })
}

module.exports.createCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body)
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images = req.files.map(f => ({ url: f.path, fileName: f.filename }))
    newCampground.owner = req.user._id
    await newCampground.save()
    req.flash('success', 'Successfully added a new campground!')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const updatedCampground = await Campground.findByIdAndUpdate(req.params.id, req.body, { new: true })
    const imgs = req.files.map(f => ({ url: f.path, fileName: f.filename }))
    updatedCampground.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let fileName of req.body.deleteImages) {
            await cloudinary.uploader.destroy(fileName)
        }
        const result = await updatedCampground.updateOne({ $pull: { images: { fileName: { $in: req.body.deleteImages } } } })
    }
    await updatedCampground.save()
    req.flash('success', 'Successfully updated a campground!')
    return res.redirect(`/campgrounds/${updatedCampground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'That campground does not exist!')
        return res.redirect('/campgrounds')
    }
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successfully deleted a campground!')
    res.redirect('/campgrounds')
}