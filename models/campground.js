const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    url: String,
    fileName: String,
})

imageSchema.virtual('thumb').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
    name: String,
    price: Number,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enums: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        required: true
    }]
}, opts)

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href=/campgrounds/${this._id}>${this.name}</a></strong><p>${this.location}</p>`
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Campground = new mongoose.model('Campground', campgroundSchema)

module.exports = Campground