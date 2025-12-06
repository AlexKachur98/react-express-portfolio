/**
 * @file project.model.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines the Mongoose schema for the Project collection.
 */
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
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
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },
        tags: {
            type: [String],
            default: []
        },
        image: {
            type: String,
            trim: true,
            maxlength: [500, 'Image URL cannot exceed 500 characters']
        },
        github: {
            type: String,
            trim: true,
            maxlength: [500, 'GitHub URL cannot exceed 500 characters']
        },
        live: {
            type: String,
            trim: true,
            maxlength: [500, 'Live URL cannot exceed 500 characters']
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Index for common query patterns
ProjectSchema.index({ createdAt: -1 });

export default mongoose.model('Project', ProjectSchema);
