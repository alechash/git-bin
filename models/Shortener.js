import mongoose from 'mongoose';

const Shortener = new mongoose.Schema({
    url: {
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
            required: false
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

export default mongoose.model('Shortener', Shortener)