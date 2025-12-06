/**
 * @file galleryItem.model.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Stores cat gallery images with metadata and base64 image data.
 */
import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true
    }
);

// Indexes for common query patterns
GalleryItemSchema.index({ createdAt: -1 }); // For listing by date
GalleryItemSchema.index({ tags: 1 }); // For filtering by tag

export default mongoose.model('GalleryItem', GalleryItemSchema);
