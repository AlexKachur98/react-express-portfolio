/**
 * @file galleryItem.model.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Stores cat gallery images with metadata and base64 image data.
 */
import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title is required'
    },
    imageData: {
        type: String,
        required: 'Image data (base64) is required'
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

export default mongoose.model('GalleryItem', GalleryItemSchema);
