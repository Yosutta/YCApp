const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console.error, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const Campground = require('../models/campground')
const Review = require('../models/review')
const { cities } = require('./cities')
const { descriptors, places } = require('./seedHelpers')

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seeddb = async () => {
    await Campground.deleteMany({})
    await Review.deleteMany({})
    for (let i = 0; i < 200; i++) {
        const rand610 = Math.floor(Math.random() * 610)
        const cityName = `${cities[rand610].city} - ${cities[rand610].admin_name}`
        const geometry = { type: 'Point', coordinates: [cities[rand610].lng, cities[rand610].lat] }
        const campName = `${sample(descriptors)} ${sample(places)}`
        const owner = "61386cf9736c254e2b3952de"
        const image = 'https://source.unsplash.com/collection/429524/1024x576'
        const description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, magnam excepturi. Eum, temporibus odio architecto provident dolorem, quae expedita, impedit quod numquam distinctio consequatur similique explicabo quasi! Neque, tenetur eveniet!'
        const price = Math.floor(Math.random() * 30)
        const newCampground = new Campground({
            name: campName,
            location: cityName,
            geometry,
            image,
            owner,
            description,
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dpishbgcn/image/upload/v1631443873/YelpCamp/uzi1ogzlyg6w35wrxtkj.jpg',
                    fileName: 'YelpCamp/uzi1ogzlyg6w35wrxtkj'
                },
                {
                    url: 'https://res.cloudinary.com/dpishbgcn/image/upload/v1631443875/YelpCamp/mrhknvdwbz8jy1chxjpi.jpg',
                    fileName: 'YelpCamp/mrhknvdwbz8jy1chxjpi'
                }
            ],
        })
        await newCampground.save()
    }
}

seeddb().then(() => {
    mongoose.disconnect()
})