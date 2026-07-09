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
        unique: true, // මේකෙන් Duplicates හැදෙන එක නවත්වනවා වගේම Auto Index වෙනවා
        trim: true
    }
}, {
    timestamps: true // Database එකට දත්ත එකතු වූ වේලාව සහ යාවත්කාලීන වූ වේලාව ස්වයංක්‍රීයව සටහන් කරයි
});

// 🚀 Performance Optimization: 
// User ලා App එකේ Search කරද්දී ඉක්මනට හොයාගන්න label එකට Index එකක් දැමීම
categorySchema.index({ label: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;