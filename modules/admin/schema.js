const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.set('useCreateIndex', true);
mongoose.set("returnOriginal", false);

const adminSchema = new Schema({
    
    
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
exports.adminModel = model('account', adminSchema)