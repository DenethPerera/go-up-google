const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        required: true,
        unique: true, 
        trim: true
    }
}, {
    timestamps: true 
});


categorySchema.index({ label: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;