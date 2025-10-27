/**
 * @file project.model.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines the Mongoose schema for the Project collection.
 */
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title is required'
    },
    description: {
        type: String,
        trim: true,
        required: 'Description is required'
    },
    category: {
        type: String,
        trim: true,
        required: 'Category is required'
    },
    imageUrl: {
        type: String,
        trim: true
    },
    projectUrl: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model('Project', ProjectSchema);
