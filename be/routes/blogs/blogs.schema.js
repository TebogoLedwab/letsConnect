const mongoose = require('mongoose');

const BlogsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdBy:{
        type: String,
        required: false

    },
    image: {
        type: String,
        required: false
    },
    likes: [String],
    dislikes: [String],
    datePosted: {
        type: Date,
        default: Date.now().toString()
    }
})

module.exports = mongoose.model('Blog', BlogsSchema);

