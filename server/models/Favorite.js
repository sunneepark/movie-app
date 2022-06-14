const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    userFrom: {
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    movieId: {
        type: String
    },
    movieTitle: {
        type: String
    },
    moviePost: {
        type: String
    },
    movieRunTime: {
        type: String
    }
}, { timestamps: true })


const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = { Favorite }