/**
 * @file project.model.js
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
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        trim: true
    },
    github: {
        type: String,
        trim: true
    },
    live: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model('Project', ProjectSchema);
