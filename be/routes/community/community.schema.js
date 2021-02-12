const mongoose = require('mongoose');


const CommunitySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: false
    },
    likes: [String],
    dislikes: [String],
    comments: [{

            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
      
        comment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now().toString()
        }
    }],
    datePosted: {
        type: Date,
        default: Date.now().toString()
    }

    })

module.exports = Community = mongoose.model('community', CommunitySchema);