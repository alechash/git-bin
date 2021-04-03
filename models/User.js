import mongoose from 'mongoose';

const User = new mongoose.Schema({
    username: {
        type: String,
        unique: false,
        required: true
    },
    email: {
        type: String,
        unique: false,
        required: false
    },
    website: {
        type: String,
        unique: false,
        required: false
    },
    bio: {
        type: String,
        unique: false,
        required: false
    },
    github: {
        type: String,
        unique: true,
        required: true
    },
    githubId: {
        type: String,
        unique: true,
        required: true
    },
    apiKey: {
        type: String,
        unique: true,
        required: true
    }
});

export default mongoose.model('User', User)