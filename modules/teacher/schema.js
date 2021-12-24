const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.set('useCreateIndex', true);
mongoose.set("returnOriginal", false);

const teacherSchema = new Schema({
    
    track: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});