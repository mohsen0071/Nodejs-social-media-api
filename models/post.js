const mongoose = require('mongoose');

const userPostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Buffer
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    likes: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

const UserPost = mongoose.model('UserPost', userPostSchema);

module.exports = UserPost; 