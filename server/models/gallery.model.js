/**
 * @file gallery.model.js
 * @purpose Stores cat gallery images with metadata and base64 image data.
 */
import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title is required'
    },
    alt: {
        type: String,
        trim: true,
        required: 'Alt text is required'
    },
    tags: {
        type: [String],
        default: []
    },
    imageData: {
        type: String,
        required: 'Image data is required'
    }
}, {
    timestamps: true
});

export default mongoose.model('GalleryImage', GallerySchema);
