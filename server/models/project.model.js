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
    firstName: {
        type: String,
        trim: true,
        required: 'First name is required'
    },
    lastName: {
        type: String,
        trim: true,
        required: 'Last name is required'
    },
    email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
        required: 'Email is required'
    },
    completion: {
        type: Date,
        required: 'Completion date is required'
    },
    description: {
        type: String,
        trim: true,
        required: 'Description is required'
    },
    category: {
        type: String,
        trim: true
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
