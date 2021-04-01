import mongoose from 'mongoose';

const Paste = new mongoose.Schema({
    paste: {
        type: String,
        unique: false,
        required: true
    },
    meta: {
        shortCode: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            unique: false,
            required: true
        },
        syntax: {
            type: String,
            unique: false,
            required: true
        },
        publicity: {
            type: String,
            unique: false,
            required: true
        },
        date: {
            type: Date,
            unique: false,
            required: true
        },
        owner: {
            type: String,
            unique: false,
            required: false
        }
    }
});

export default mongoose.model('Paste', Paste)