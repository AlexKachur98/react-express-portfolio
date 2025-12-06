/**
 * @file service.model.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Defines the Mongoose schema and model for service offerings.
 */
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: 'Title is required',
            maxlength: [200, 'Title cannot exceed 200 characters']
        },
        description: {
            type: String,
            trim: true,
            required: 'Description is required',
            maxlength: [1000, 'Description cannot exceed 1000 characters']
        },
        highlight: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            trim: true,
            maxlength: [500, 'Icon URL cannot exceed 500 characters']
        },
        iconLabel: {
            type: String,
            trim: true,
            maxlength: [100, 'Icon label cannot exceed 100 characters']
        }
    },
    {
        timestamps: true
    }
);

// Index for common query patterns
ServiceSchema.index({ createdAt: -1 });

export default mongoose.model('Service', ServiceSchema);
