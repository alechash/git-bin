import mongoose from 'mongoose';

const ShortStat = new mongoose.Schema({
    shortCode: {
        type: String,
        unique: false,
        required: true
    },
    meta: {
        browser: {
            type: String,
            unique: false,
            required: true
        },
        version: {
            type: String,
            unique: false,
            required: true
        },
        os: {
            type: String,
            unique: false,
            required: true
        },
        platform: {
            type: String,
            unique: false,
            required: true
        },
        userAgent: {
            type: String,
            unique: false,
            required: true
        }
    }
});

export default mongoose.model('ShortStat', ShortStat)