import mongoose from 'mongoose';

const User = new mongoose.Schema({
});

export default mongoose.model('User', User)